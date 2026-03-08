const property = require("../Model/propertyModel");
const validateProperty = require("../validation/Property");
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from env vars
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfzwynbsl',
    api_key: process.env.CLOUDINARY_API_KEY || '392361113499844',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'to_UWrKOwt73oXRlD8ZaQqRfW-g',
});

const prepareFileName = file => {
    let name = file.name.split(/[ \.]/g)
    let extension = name.pop()
    name = name.join("-")
    return Date.now() + "." + name.substring(0, 10) + "." + extension
}

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'treasury-properties', resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        ).end(file.data);
    });
};

const propertyCtrl = {
	//Function to create ico property.
	createProperty: async (req, res) => {
		try {
			const { errors, isValid } = validateProperty(req.body);
			if (!isValid) {
				return res.json({ status: 0, errors });
			}
			const {
				userId,
				title,
				propertyDeed,
				propertyEstimatedValue,
				generatic_income,
				description,
                imageName,
				address,
				percentageOfOwnership,
				toggle,
			} = req.body;

			const Property = new property({
				userId,
				title,
				propertyDeed,
				propertyEstimatedValue,
				generatic_income,
				description,
				address,
				percentageOfOwnership,
				toggle,
				status: 0,
			});
			const checkProperty = await property.findOne({ title });
			if (checkProperty) {
				return res.json({ status: 0, errors:{ title: "This property already exist!" }});
			}
			//Saving ico property in database.
			await Property.save();
			res.json({
				status: 1,
				Property,
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

     upload:  async (req, res) => {
        try {
            const images = req.files["images"];
            let imagename = [];
            // Always use Cloudinary for persistent storage
            if (Array.isArray(images)) {
                imagename = await Promise.all(images.map(uploadToCloudinary));
            } else {
                imagename = [await uploadToCloudinary(images)];
            }
            // Handle deed upload (optional)
            let deed_url = null;
            if (req.files && req.files.deed) {
                const deed = req.files.deed;
                deed_url = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'treasury-deeds', resource_type: 'raw' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(deed.data);
                });
            }
            res.json({ 
                image_url: imagename,
                deed_url,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

	updateProperty: async (req, res) => {
		try {
			const { errors, isValid } = validateProperty(req.body);
			if (!isValid) {
				return res.json({ status: 0, errors });
			}
			const {
				title,
				contract_address,
				tokenPrice,
				propertyEstimatedValue,
				generatic_income,
				description,
				address,
				percentageOfOwnership,
				status,
			} = req.body;

			const updateData = {
				title,
				contract_address,
				tokenPrice,
				propertyEstimatedValue,
				generatic_income,
				description,
				address,
				percentageOfOwnership,
				status,
			};
			await property.updateOne({ _id: req.body._id }, updateData);
			res.json({
				status: 1,
				property,
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	//Function to read specific ico by its id.
	getProperty: async (req, res) => {
		try {
			console.log(`[API] GET /api/get_property called with query:`, req.query);
			let status = req.query.status;
			let query = {};
			if(status){
				// Convert status to number if it's a string
				query.status = parseInt(status) || status;
			}
			console.log(`[API] Querying properties with:`, query);
			const Property = await property.find(query).lean();
			console.log(`[API] Found ${Property.length} properties`);
			res.json(Property);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getPropertyById: async (req, res) => {
		try {
			const Property = await property.find({ _id: req.params.id });
			res.json(Property);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	deleteProperty: async (req, res) => {
		try {
			await property.deleteOne({ _id: req.body.property_id });
			res.json({ status: 0 });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updatePropertyFile: async (req, res) => {
		try {
			const updateData=req.body.data;
			await property.updateOne({ _id: req.body._id }, updateData);
			res.json({ status: 1});
		} catch (err) {
			
			return res.status(500).json({ msg: err.message ,updateData:updateData , err:err});
		}
	},

	// Upload new images for an existing property and update imageName array
	uploadPropertyImages: async (req, res) => {
		try {
			const propertyId = req.body.propertyId;
			if (!propertyId) return res.status(400).json({ msg: 'propertyId is required' });
			const images = req.files && req.files['images'];
			if (!images) return res.status(400).json({ msg: 'No images provided' });
			let imagename = [];
			if (Array.isArray(images)) {
				imagename = await Promise.all(images.map(uploadToCloudinary));
			} else {
				imagename = [await uploadToCloudinary(images)];
			}
			await property.updateOne({ _id: propertyId }, { imageName: imagename });
			res.json({ status: 1, imageName: imagename });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	changeData: async (req, res) => {
		try {
			let { units, amount, propertyId } = req.body;
			if(units){
				units=units.replace(/[^0-9\.]+/g, "");
				var Property = await property.findOne({_id: propertyId});
				var data={
					units,
					amount: (units*Property.tokenPrice)
				}
			}
			else{
				amount=amount.replace(/[^0-9\.]+/g, "");
				var Property = await property.findOne({_id: propertyId});
				var data={
					units: (amount/Property.tokenPrice),
					amount
				}
			}
			res.json({ status: 1, data });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};
const saveImage = image => {
    const name = prepareFileName(image)
    image.mv("./frontend/public/img/" + name);
    return "/img/" + name ;
}

module.exports = propertyCtrl;
