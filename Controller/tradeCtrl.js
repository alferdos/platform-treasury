const Trade = require("../Model/tradeModel");
const Transaction = require("../Model/transactionModel")
const Property = require("../Model/propertyModel");
const User = require("../Model/userModel");
const Balance = require("../Model/balanceModel");
const ChartData = require("../Model/chartDataModel");

const validateTradeInput = require("../validation/trade");

async function reconcileTrades(matches, trade) {
    var totalToken=trade.units;
    var counter=0;
    //console.log(matches);
    //matches.forEach(async function(match, i){
    for (let i=0; i< matches.length; i++){ 
        var match=matches[i];
        var exactMatch={ price: 0 };
        //console.log(totalToken);
        if(totalToken>0){
            var matchTokens=match.units;
            if(totalToken<matchTokens){
                matchTokens=totalToken;
                //match.price-=trade.price;
                matches[i].units=parseInt(match.units)-totalToken;
                //matches[i].units=1;
                matches[i].save();
                counter++;
            }
            exactMatch=matches[i];
            var tokenValue=totalToken;
            totalToken=totalToken-matchTokens;
            var transaction1 = new Transaction({
                propertyId: match.propertyId,
                userId: match.userId,
                units: matchTokens,
                price: match.price,
                action: match.action,
                isSubscription: false
            });
            await transaction1.save()
            var chartData = new ChartData({
                propertyId: match.propertyId,
                time: new Date(),
                price: match.price
            });
            await chartData.save()
            updateBalanceToken(transaction1);
            updateUserBalance(transaction1, match);
            if(counter==0){
                await matches[i].delete();
            }
            if(tokenValue>0){
                var transaction2 = new Transaction({
                    propertyId: trade.propertyId,
                    userId: trade.userId,
                    units: matchTokens,
                    price: match.price,
                    action: trade.action,
                    isSubscription: false
                })
                await transaction2.save();
                updateBalanceToken(transaction2);
                updateUserBalance(transaction2, trade);
            }
        }
    }
    if(totalToken>0){
        let tradeData = new Trade({
            propertyId: trade.propertyId,
            userId: trade.userId,
            units: totalToken,
            priceType: trade.priceType,
            price: exactMatch.price,
            action: trade.action,
        });
        tradeData.save();
    }
}
async function updateBalanceToken(transaction) {
    var balance=await Balance.findOne({userId: transaction.userId, propertyId: transaction.propertyId});
    if(balance==null){
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var bal = new Balance({
            userId: transaction.userId,
            propertyId: transaction.propertyId,
            units: transaction.units,
            date: date+""+month+""+year,
        });
        bal.save();
    }
    else{
        var updateToken=(transaction.action=="buy")?(balance.units+transaction.units):(balance.units-transaction.units);
        balance.units=updateToken;
        await balance.save();
    }
}
async function updateUserBalance(transaction, trade) {
    var user=await User.findOne({_id: transaction.userId});
    var updateBalance=(transaction.action=="buy")?(user.totalBalance-(transaction.units*transaction.price)):(user.totalBalance+(transaction.units*transaction.price));
    user.totalBalance=updateBalance;
    await user.save();
    var property = await Property.findOne({_id: transaction.propertyId});
    property.tokenPrice=transaction.price;
    await property.save();
}

const tradeCtrl = {
    trade: async (req, res) => {
        try {
            const { errors, isValid } = validateTradeInput(req.body);
            if (!isValid) {
                return res.json({ status: 0, errors });
            }
            const { propertyId, userId, units, priceType, marketPrice, price, action } = req.body;
            const propertyData = await Property.findById(propertyId)
            // reject if the property is not tradeable.
            if (propertyData.tokenSupply !== propertyData.totalTokenSupply) {
                return res.json({ status: 0, msg: "The property is not tradeable." })
            }
            const userData = await User.findById(userId)
            // reject if the user has insufficient units or $$
            if (action === "sell") {
                var balanceData = await Balance.findOne({ userId, propertyId })
                errors.units = "You don't have any units of this property."
                if (!balanceData) return res.json({status: 0, errors})
                if (balanceData.units < units) {
                    errors.units = "You only have "+ balanceData.units + " units." 
                    return res.json({ status: 0, errors })
                }
            } else {
                var value = priceType === "customPrice" ? units * parseInt(price) : units * propertyData.tokenPrice;
                if (userData.totalBalance < value) {
                    errors.price = "You don't have enough monetary balance."
                    return res.json({ status: 0, errors})
                }
            }
            // create new trade
            let tradeData = new Trade({
                propertyId,
                userId,
                units,
                priceType,
                price: (priceType !== "marketPrice") ? parseInt(price) : parseInt(marketPrice),
                action
            });
            // find matching trades
            if (action === "sell") {
                if(tradeData.priceType=="marketPrice"){
                    var matches = await Trade.find({ action: "buy", propertyId: tradeData.propertyId, userId: {$nin: [tradeData.userId]} }).sort({ units: -1 })
                    var m = await Trade.find({ action: "buy", propertyId: tradeData.propertyId }).sort({ units: -1 })
                    if(m.length==0){
                        return res.json({ status: 0, errors:{priceType: "You can't sell in market price!"}});
                    }
                    else{
                        tradeData.price=m[0].price;
                    }
                }
                else{
                    //var matches = await Trade.find({ isOpen: true, action: "buy", propertyId: tradeData.propertyId, units: tradeData.units, userId: {$nin: [tradeData.userId]}, price: { $gte:tradeData.price } }).sort({ price: -1 })
                    var matches = await Trade.find({ action: "buy", propertyId: tradeData.propertyId, userId: {$nin: [tradeData.userId]}, price: { $gte:tradeData.price } }).sort({ units: -1 })
                }
                
            } else {
                if(tradeData.priceType=="marketPrice"){
                    var matches = await Trade.find({ action: "sell", propertyId: tradeData.propertyId, userId: {$nin: [tradeData.userId]} }).sort({ units: 1 })
                    var m = await Trade.find({ action: "sell", propertyId: tradeData.propertyId }).sort({ units: 1 })
                    if(m.length==0){
                        return res.json({ status: 0, errors:{priceType: "You can't buy in market price!"}});
                    }
                    else{
                        tradeData.price=m[0].price;
                    }
                }
                else{
                    //var matches = await Trade.find({ isOpen: true, action: "sell", propertyId: tradeData.propertyId, units: tradeData.units, userId: {$nin: [tradeData.userId]}, price: { $lte: tradeData.price } }).sort({ price: 1 })
                    var matches = await Trade.find({ action: "sell", propertyId: tradeData.propertyId, userId: {$nin: [tradeData.userId]}, price: { $lte:tradeData.price } }).sort({ units: 1 })
                }
            }
            // reconcile trades and make transactions
            if (matches.length > 0) {
                let transactions = await reconcileTrades(matches, tradeData);
                res.json({ status: 1, message: "Your trade has been registered successfully with transaction!"});
            } else {
                tradeData.save();
                res.json({ status: 1, message: "Your trade has been registered successfully. Currently, there are no other trades that match your trade's price."});
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getTradeByPropId: async (req, res) => {
        try {
            let action = req.query.action;
            if (action) {
                var priceSort=(action=="buy")?-1:1;
                var trade = await Trade.find({ propertyId: req.params.propId, action, isOpen: true }).sort({ price: priceSort });
            }
            else {
                var trade = await Trade.find({ propertyId: req.params.propId, isOpen: true }).sort({price: -1});
            }
            res.json(trade);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getChartData: async (req, res) => {
        var chartdata = await ChartData.find({ propertyId: req.params.propId});
        res.json(chartdata);
    },
};

module.exports = tradeCtrl;
