/**
 * Update Social 2019
 * Written by Ben Vernazza
 */

import { Log } from "./modules/logger.js";
import { checkIfSessionValid } from "./modules/sessionhandler.js";

export function Main() {
    Log("Initializing.");

    checkIfSessionValid();
}
