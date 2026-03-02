const RequestFund = require("../Model/requestFundModel");
const User = require("../Model/userModel");

const requestFundCtrl = {
    requestFund: async (req, res) => {
        try {
            const { userId, amount } = req.body;
            var timestamp = Date.now();
			var fileData=req.files.file;
			var fileName = timestamp + "." + fileData.name.split(".").pop();
			fileData.mv("./frontend/public/invoice/" + fileName);
            let requestfund = new RequestFund({
                userId,
                amount,
                invoice: fileName
            });
            requestfund.save();
            res.json({ status: 1 });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getRequestFund: async (req, res) => {
        try {
            let isApproved=req.query.isApproved;
            if(isApproved){
                var requestFund = await RequestFund.find({isApproved}).populate('userId');
            }
            else{
			    var requestFund = await RequestFund.find().populate('userId');
            }
			res.json(requestFund);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    approveRequest: async (req, res) => {
        try {
            const { requestId } = req.body;
            var getRequest = await RequestFund.findOne({_id: requestId});
            getRequest.isApproved=true;
            getRequest.save();
            var user = await User.findOne({_id: getRequest.userId});
            user.totalBalance=user.totalBalance+getRequest.amount;
            user.save();
			res.json({ status: 1 });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = requestFundCtrl;
