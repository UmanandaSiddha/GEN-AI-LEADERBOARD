import fs from 'fs';
import csv from 'csv-parser';
import User from './user.model.js';
import WebScrapper from './scrapper.js';

export const pushToDatabase = async (req, res) => {
    try {
        fs.createReadStream('./gen.csv')
        .pipe(csv())
        .on('data', async (row) => {
            const filteredRow = {
                name: row['FULL_NAME'],
                publicProfile: row['PUBLIC_URL']
            };

            try {
                await User.create(filteredRow);
                console.log('Inserted document:', filteredRow);
            } catch (error) {
                console.error('Error inserting document:', error.message);
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed and database populated');
            res.status(200).json({
                success: true,
                message: "CSV file processed successfully and data inserted"
            });
        });
    } catch (error) {
        console.error('Error processing CSV file:', error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const addNewUser = async (req, res) => {
    try {
        const { name, url } = req.body;
        if (!name ||!url) {
            return res.status(400).json({
                success: false,
                message: "Name and URL are required"
            });
        }

        const user = await User.findOne({ publicProfile: url });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = await User.create({
            name,
            publicProfile: url
        });

        res.status(200).json({
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const getArcadeUsers = async (req, res) => {
    try {
        const users = await User.find({
            badges: { $elemMatch: { title: "Level 3: Google Cloud Adventures" } }
        });
        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('Error getting arcade users:', error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const scrapUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await WebScrapper(user.publicProfile);

        res.status(200).json({
            success: true,
            message: "User scraped successfully"
        });
    } catch (error) {
        console.error('Error scrapping User By Id:', error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $addFields: {
                    badgeCount: { $size: "$badges" }  // Count of badges
                }
            },
            { $sort: { badgeCount: -1 } }, // Highest badge count first
            { $unwind: { path: "$badges", preserveNullAndEmptyArrays: true } },         // Flatten badges for individual date sorting
            { $sort: { "badges.time": 1 } }, // Sort by earliest badge date
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },  // Get the name
                    publicProfile: { $first: "$publicProfile" }, // Get the publicProfile URL
                    userName: { $first: "$profile.userName" },  // Get the username
                    points: { $first: "$league.points" },  // Get the points
                    badgeCount: { $first: "$badgeCount" }  // Keep the badge count for sorting
                }
            },
            { $sort: { badgeCount: -1, "points": -1 } }, // Final sort for leaderboard
            {
                $project: {
                    _id: 1,                // Include _id
                    name: 1,               // Include the name
                    publicProfile: 1,      // Include the publicProfile URL
                    userName: 1,           // Include the username
                    badgeCount: 1,         // Include the badge count only
                    points: 1              // Include the points
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('Error fetching all Users:', error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching User By Id:', error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const getUserUpdatedAt = async (req, res) => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
        const users = await User.find({ updatedAt: { $gte: tenMinutesAgo } });
        res.status(200).json({
            success: true,
            count: users.length
        });
    } catch (error) {
        console.error("Error fetching recent users:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const getUserBadges = async (req, res) => {
    try {
        const users = await User.find({$expr: { $gte: [{ $size: "$badges" }, 17] }});
        res.status(200).json({
            success: true,
            count: users.length
        });
    } catch (error) {
        console.error("Error fetching recent users:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const deleteUsersGroup = async (req, res) => {
    const publicProfilesToDelete = [];
    try {
        const result = await User.deleteMany({
            publicProfile: { $in: publicProfilesToDelete }
        });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} users deleted successfully`,
        });
    } catch (error) {
        console.error("Error deleting users group:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}