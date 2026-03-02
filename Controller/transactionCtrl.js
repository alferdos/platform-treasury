const User = require("../Model/userModel");
const property = require("../Model/propertyModel");
const Transaction = require("../Model/transactionModel");
const Balance = require("../Model/balanceModel");

const validateTransactionInput = require("../validation/transaction");

const transactionController = {
	buy: async (req, res) => {
		try {
            const { errors, isValid } = validateTransactionInput(req.body);
			// Check Validation
			if (!isValid) {
				return res.json({ status: 0, errors });
			}
		    const { propertyId, userId, units, amount } = req.body;
            let propertyData=await property.findOne({_id: propertyId});
            if((propertyData.tokenSupply+parseInt(units)) > propertyData.totalTokenSupply){
                return res.json({ status: 0 });
            }
            else{
                const newTransaction = new Transaction({
                    propertyId,
                    userId,
                    units,
                    price: propertyData.tokenPrice,
                    action: 'buy',
                    isSubscription: true
                });
                await newTransaction.save();
                Balance.findOne({propertyId, userId}).then(async function(result){
                    if(result==null){
                        let ts = Date.now();
                        let date_ob = new Date(ts);
                        let date = date_ob.getDate();
                        let month = date_ob.getMonth() + 1;
                        let year = date_ob.getFullYear();
                        const balance = new Balance({
                            propertyId,
                            userId,
                            units,
                            date: date+""+month+""+year,
                        });
                        await balance.save();
                    }
                    else{
                        await Balance.findOneAndUpdate({propertyId, userId}, {units: (parseInt(units)+result.units)});
                    }
                    let user = await User.findOne({_id: userId});
                    user.totalBalance-=amount;
                    user.save();
                    let propData = await property.findById(propertyId);
                    propData.tokenSupply+=parseInt(units);
                    propData.save();
                    // User.findOne({_id: userId}).then(async function(userRes){
                    //     let propData = await property.findById(propertyId);
                    //     await User.findOneAndUpdate({_id: userId}, {totalBalance: ((parseInt(units)*propData.tokenPrice)+userRes.totalBalance)});
                    //     await property.findOneAndUpdate({_id: propertyId}, {tokenSupply: (parseInt(units)+propData.tokenSupply)});
                    // });
                });
                res.json({
                    status: 1,
                    msg: "You have buy the unit!",
                });
            }
        } catch (err) {
		    return res.status(500).json({ msg: err.message });
		}
	},

    sell: async (req, res) => {
		try {
            const { errors, isValid } = validateTransactionInput(req.body);
			// Check Validation
			if (!isValid) {
				return res.json({ status: 0, errors });
			}
		    const { propertyId, userId, units } = req.body;
            Balance.findOne({propertyId, userId}).then(async function(result){
                if(result==null){
                    return res.json({ status: 0 });
                }
                else{
                    if(result.balance>=units){
                        await Balance.findOneAndUpdate({propertyId, userId}, {units: (result.units-parseInt(units))});
                        const newTransaction = new Transaction({
                            propertyId,
                            userId,
                            units,
                            action: 'sell',
                            isSubscription: true,
                        });
                        await newTransaction.save();
                        User.findOne({_id: userId}).then(async function(userRes){
                            let propData = await property.findById(propertyId);
                            await User.findOneAndUpdate({_id: userId}, {totalBalance: (userRes.totalBalance-(parseInt(units)*propData.tokenPrice))});
                            await property.findOneAndUpdate({_id: propertyId}, {tokenSupply: (propData.tokenSupply-parseInt(units))});
                        });
                        res.json({
                            status: 1,
                            msg: "You have sell the unit!",
                        });
                    }
                    else{
                        return res.json({ status: 0 });
                    }
                }
            });
        } catch (err) {
		    return res.status(500).json({ msg: err.message });
		}
	},
	
	allTransaction: async (req, res) => {
        var transaction=await Transaction.find();
        res.json({
            transaction
        });
    },
	
	getTransactionByPropId: async (req, res) => {
		try {
            let isSubscription=req.query.isSubscription;
            if(isSubscription){
                let userId=req.query.userId;
                if(userId){
                    var transaction = await Transaction.find({propertyId: req.params.propId, userId, isSubscription}).sort( { createdAt : -1 } );
                }
                else{
                    var transaction = await Transaction.find({propertyId: req.params.propId, isSubscription}).sort( { createdAt : -1 } );
                }
            }
            else{
			    var transaction = await Transaction.find({propertyId: req.params.propId}).sort( { createdAt : -1 } );
            }
			res.json(transaction);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

    getTransactionByUserId: async (req, res) => {
        try {
			const transaction = await Transaction.find({userId: req.params.userId}).populate('propertyId');
			res.json(transaction);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
    },

    getBalanceByUserId: async (req, res) => {
		try {
			const balance = await Balance.find({userId: req.params.userId}).populate('propertyId');
			res.json(balance);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = transactionController;
