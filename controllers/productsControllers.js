

const productsControllers = {
    productCreate: (req,res) => {
        res.render('./product/productCreate');
    },
    productDetail: (req,res) => {
        res.render('./product/productDetail');
    },
    editProduct : (req, res) => {
        res.render('./product/editProduct');
    },
    productList: (req,res) => {
        res.render('./product/productList');
    },
    productcamps: (req, res) => {
        res.render(req.body);
    }
    
}

module.exports = productsControllers;