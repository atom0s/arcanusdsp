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

"use strict";

/**
 * Exposes functions related to DarkStar spells.
 *
 * @param {object} arcanus                          The arcanus application instance.
 */
module.exports = function (arcanus) {
    var SpellModule = {};

    /**
     * Gets a list of blue spells.
     *
     * @param {function} done                   The callback to invoke when the function has completed.
     */
    SpellModule.getBlueSpells = function (done) {
        const sql = `SELECT bsl.spellid, sl.name FROM blue_spell_list AS bsl
                     LEFT JOIN spell_list AS sl ON bsl.spellid = sl.spellid
                     ORDER BY sl.name ASC;`;

        arcanus.db.query(sql, [], function (err, rows) {
            if (err)
                return done(err, false);

            var spells = [];
            rows.forEach(function (s) {
                spells.push(s);
            });

            return done(null, spells);
        });
    };

    /**
     * Gets a blue spell by its spell id.
     *
     * @param {number} spellid                  The blue magic spell id.
     * @param {function} done                   The callback to invoke when the function has completed.
     */
    SpellModule.getBlueSpellById = function (spellid, done) {
        const sql = `SELECT bsl.spellid, sl.name, mg.zoneid, zs.name AS zonename, msp.* FROM dspdb.blue_spell_list AS bsl
                     LEFT JOIN spell_list AS sl ON bsl.spellid = sl.spellid
                     LEFT JOIN mob_skills AS ms ON bsl.mob_skill_id = ms.mob_skill_id
                     LEFT JOIN mob_pools AS mp ON ms.family_id = mp.familyid
                     LEFT JOIN mob_groups AS mg ON mp.poolid = mg.poolid
                     LEFT JOIN mob_spawn_points AS msp ON mg.groupid = msp.groupid
                     LEFT JOIN zone_settings AS zs ON mg.zoneid = zs.zoneid
                     WHERE bsl.spellid = ? AND mobid IS NOT null;`;

        arcanus.db.query(sql, [spellid], function (err, rows) {
            if (err)
                return done(err, false);

            var monsters = [];
            rows.forEach(function (m) {
                monsters.push(m);
            });

            return done(null, monsters);
        });
    };

    // Return the spell module..
    return SpellModule;
};