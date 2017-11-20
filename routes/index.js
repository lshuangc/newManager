module.exports = function(app) {
    app.get('/*', function (req, res) {
        console.log(req.url);
        switch (req.url.split("?")[0]){
            case '/':res.render('login', {});break;
            case '/index.html':res.render('index', {});break;
            case '/property.html':res.render('property', {});break;
            case '/seller.html':res.render('seller', {});break;
            case '/user.html':res.render('user', {});break;
            case '/recommendNew.html':res.render('recommendNew', {});break;
            case '/prompt.html':res.render('prompt', {});break;
            case '/insideProject.html':res.render('insideProject', {});break;
            case '/moreUser.html':res.render('moreUser', {});break;
            case '/login.html':res.render('login', {});break;
        }
    });
};

