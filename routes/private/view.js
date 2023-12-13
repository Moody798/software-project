const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');


function handlePrivateFrontEndView(app) {

    app.get('/dashboard' , async (req , res) => {
        
        const user = await getUser(req);
        if(user.role == "admin"){
            return res.render('adminHomepage' , {name : user.name});
        }
        // role of customer
        return res.render('customerHomepage' , {name : user.name});
    });
  
}  
  
module.exports = {handlePrivateFrontEndView};
  