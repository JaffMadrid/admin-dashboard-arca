module.exports = function(req, res, next) {
    const { name, email, user, password, role } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      console.log(!email.length);
      if (![name, email, user, password, role].every(Boolean)) {
        return res.json("Credenciales Inexistentes");
      } else if (!validEmail(email)) {
        return res.json("Email no valido");
      }
    } else if (req.path === "/login") {
      if (![user, password].every(Boolean)) {
        return res.json("Credenciales Inexistentes");
      } 
    }
  
    next();
  };