/**
 * arcanus - Copyright (c) 2015-2016 atom0s [atom0s@live.com]
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to
 * Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * By using arcanus, you agree to the above license and its terms.
 *
 *      Attribution - You must give appropriate credit, provide a link to the license and indicate if changes were
 *                    made. You must do so in any reasonable manner, but not in any way that suggests the licensor
 *                    endorses you or your use.
 *
 *   Non-Commercial - You may not use the material (arcanus) for commercial purposes.
 *
 *   No-Derivatives - If you remix, transform, or build upon the material (arcanus), you may not distribute the
 *                    modified material. You are, however, allowed to submit the modified works back to the original
 *                    arcanus project in attempt to have it added to the original project.
 *
 * You may not apply legal terms or technological measures that legally restrict others
 * from doing anything the license permits.
 *
 * You may contact me, atom0s, at atom0s@live.com for more information or if you are seeking commercial use.
 *
 * No warranties are given.
 */

var express = require('express');
var router = express.Router();
var socket = require('net');

/**
 * Exposes route endpoints for the ajax callbacks of the website.
 *
 * @param {Object} arcanus                      The arcanus application instance.
 */
module.exports = function (arcanus) {
    /**
     * Gets the latest news posts from the forums.
     *
     * @param {object} req                      The request object.
     * @param {object} res                      The response object.
     * @param {function} next                   The callback function to continue the request chain.
     */
    router.get('/latestnews', function (req, res, next) {
        // Obtain the posts from the news service..
        var newsService = arcanus.services.get('newsservice');
        newsService.getNewsPosts(function (err, posts) {
            if (err || posts === null)
                return res.status(204).send('[]');
            return res.status(200).send(posts);
        });
    });

    /**
     * Gets the servers current online status.
     *
     * @param {object} req                      The request object.
     * @param {object} res                      The response object.
     * @param {function} next                   The callback function to continue the request chain.
     */
    router.get('/serverstatus', function (req, res, next) {
        // Obtain the configurations..
        var cfg = arcanus.config.darkstar || null;
        if (!cfg)
            return res.status(204).send(false);

        // Connects to the server to determine if it's currently online..
        var client = socket.connect({
            host: cfg.host,
            port: cfg.port
        }, function () {
            return res.status(200).send(true);
        });

        // Error handler..
        client.on('error', function (err) {
            return res.status(204).send(false);
        });

        // Complete the connection..
        client.end();
    });

    /**
     * Gets the current online characters.
     *
     * @param {object} req                      The request object.
     * @param {object} res                      The response object.
     * @param {function} next                   The callback function to continue the request chain.
     */
    router.get('/onlinecharacters', function (req, res, next) {
        // Obtain the characters from the DarkStar service..
        var dsService = arcanus.services.get('darkstarservice');
        dsService.Characters.getOnlineCharacters(function (err, characters) {
            var status = (err || characters === null) ? 500 : 200;
            return res.status(status).send(characters);
        });
    });

    /**
     * Frees a stuck character.
     *
     * @param {object} req                      The request object.
     * @param {object} res                      The response object.
     * @param {function} next                   The callback function to continue the request chain.
     */
    router.get('/unstuck', function (req, res, next) {
        // Ensure the requesting user is logged in..
        if (!req.user || !req.user.id)
            return res.status(401).send(false);

        // Obtain the character id from the request..
        var charid = parseInt(req.query.charid) || 0;
        if (!charid || charid === 0)
            return res.status(400).send(false);

        // Attempt to free the stuck character..
        var dsService = arcanus.services.get('darkstarservice');
        dsService.Characters.unstuckCharacter(req.user.id, charid, function (err, result) {
            var status = (err || result === null) ? 400 : 200;
            return res.status(status).send(result);
        });
    });

    // Return the router..
    return router;
};