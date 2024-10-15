import express from "express";
import { 
    addNewUser, 
    deleteUser, 
    deleteUsersGroup, 
    getAllUsers, 
    getUserBadges, 
    getUserById, 
    getUserUpdatedAt, 
    pushToDatabase 
} from "./user.controller.js";
import { isAdmin } from "./auth.middlware.js";

const router = express.Router();

router.route("/push").get(pushToDatabase);
router.route("/new").post(isAdmin, addNewUser);
router.route("/all").get(getAllUsers);
router.route("/byId/:id")
    .get(getUserById)
    .delete(isAdmin, deleteUser);
router.route("/del/group").delete(isAdmin, deleteUsersGroup);
router.route("/recent").get(isAdmin, getUserUpdatedAt);
router.route("/badges").get(isAdmin, getUserBadges);

export default router;