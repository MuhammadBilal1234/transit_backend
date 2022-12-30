module.exports = function (app, ensureAuth) {

    var index = require('../endpoints/index');
    var web_auth = require('../endpoints/web_auth');
    var protectedR = require('../endpoints/protected');//test route for protected endpoint;
    var registration = require('../endpoints/registration');
    var confirm_user_by_email = require('../endpoints/confirm_user_by_email');
    var reset_password = require('../endpoints/reset_password');
    var do_reset = require('../endpoints/do_reset');
    var find_nearest_stops = require('../endpoints/find_nearest_stops');
    var recalculate_stops = require('../endpoints/recalculate_stops');
    var saveRoute = require('../endpoints/save_route');
    var getRoutes = require('../endpoints/get_routes');
    var deleteRoute = require('../endpoints/delete_route');
    var getSingleRoutes = require('../endpoints/get_single_route');
    var download_gtfx = require('../endpoints/download_gtfx');
    var get_services = require('../endpoints/get_services');
    var update_service = require('../endpoints/update_service');
    var delete_service = require('../endpoints/delete_service');
    var get_agencies = require('../endpoints/get_agencies');
    var new_agency = require('../endpoints/new_agency');
    var delete_agency = require('../endpoints/delete_agency');
    var get_gtfs = require('../endpoints/get_gtfs');
    var view_visualization = require('../endpoints/view_visualization');
    var display_timetable = require('../endpoints/display_timetable');
    var download_gtfs = require('../endpoints/download_gtfs_file');
    var route_nodes = require('../endpoints/route_nodes');


    //PUBLIC ENDPOINTS
    app.use('/', index);
    app.use('/recalculate_stops', recalculate_stops);//temporal to create geoSpatial index
    app.use('/auth/web', web_auth);
    app.use('/confirm_user_by_email', confirm_user_by_email);
    app.use('/download_gtfx', download_gtfx);
    app.use('/registration', registration);
    app.use('/reset_password', reset_password);
    app.use('/do_reset', do_reset);
    app.use('/view_visualization', view_visualization);
    app.use('/display_timetable', display_timetable);
    app.use('/download_gtfs', download_gtfs);    

    //PROTECTED ENDPOINTS
    app.use('/protected', ensureAuth, protectedR);
    app.use('/save_route', ensureAuth, saveRoute);
    app.use('/get_routes', ensureAuth, getRoutes);
    app.use('/get_single_route', ensureAuth, getSingleRoutes);
    app.use('/delete_route', ensureAuth, deleteRoute);
    app.use('/find_nearest_stops', ensureAuth, find_nearest_stops);
    app.use('/get_services', ensureAuth, get_services);
    app.use('/update_service', ensureAuth, update_service);
    app.use('/delete_service', ensureAuth, delete_service);
    app.use('/get_agencies', ensureAuth, get_agencies);
    app.use('/new_agency', ensureAuth, new_agency);
    app.use('/delete_agency', ensureAuth, delete_agency);
    app.use('/get_gtfs', ensureAuth, get_gtfs);
    app.use('/nodes',  ensureAuth, route_nodes);
};