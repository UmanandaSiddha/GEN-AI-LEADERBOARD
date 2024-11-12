import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import User from './user.model.js';

const WebScrapper = async (url) => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors', '--ignore-ssl-errors');
    
    let retries = 3;
    let driver;

    while (retries > 0) {
        try {
            driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

            const user = await User.findOne({ publicProfile: url });
            if (!user) {
                console.error(`User with public profile ${url} not found in database`);
                return;
            }

            if (user.badges.length < 17) {
                await driver.get(url);

                const profileData = {};

                try {
                    profileData.username = await driver.findElement(By.className('ql-display-small')).getText();
                } catch (error) {
                    console.log("Username not found:", error.message);
                }

                try {
                    profileData.avatar = await driver.findElement(By.className('profile-avatar')).getAttribute('src');
                } catch (error) {
                    console.log("Avatar not found:", error.message);
                }

                try {
                    profileData.memberSince = await driver.findElement(By.className('ql-body-large')).getText();
                } catch (error) {
                    console.log("Membership date not found:", error.message);
                }

                try {
                    const leagueElement = await driver.findElement(By.className('profile-league'));
                    profileData.league = await leagueElement.findElement(By.className('ql-headline-medium')).getText();
                    profileData.body = await leagueElement.findElement(By.css('strong')).getText();
                    profileData.points = Number(profileData.body.split(" ")[0]);
                    profileData.leagueImage = await leagueElement.findElement(By.css('img')).getAttribute('src');
                } catch (error) {
                    console.log("League information not found:", error.message);
                }

                profileData.profileBadges = [];
                try {
                    const badgeElements = await driver.findElements(By.className('profile-badge'));
                    for (let badgeElement of badgeElements) {
                        try {
                            const title = await badgeElement.findElement(By.className('ql-title-medium')).getText();
                            const earnedDate = await badgeElement.findElement(By.className('ql-body-medium')).getText();
                            const extractedDateString = `${earnedDate.split(' ')[1]} ${earnedDate.split(' ')[2]} ${earnedDate.split(' ')[3]}`;
                            const timeDate = new Date(extractedDateString);
                            const badgeImage = await badgeElement.findElement(By.css('img')).getAttribute('src');

                            profileData.profileBadges.push({ title, earned: earnedDate, time: timeDate, image: badgeImage });
                        } catch (badgeError) {
                            console.log("Badge element not found:", badgeError.message);
                        }
                    }
                } catch (error) {
                    console.log("Badge information not found:", error.message);
                }

                await User.findOneAndUpdate(
                    { publicProfile: url },
                    {
                        profile: {
                            userName: profileData.username || user.profile.userName,
                            avatar: profileData.avatar || user.profile.avatar,
                            member: profileData.memberSince || user.profile.member,
                        },
                        league: {
                            title: profileData.league || user.league.title,
                            body: profileData.body || user.league.body,
                            points: profileData.points || user.league.points,
                            image: profileData.leagueImage || user.league.image,
                        },
                        badges: profileData.profileBadges,
                    },
                    { new: true, runValidators: true }
                );

                console.log(JSON.stringify(profileData, null, 4));
            }
            retries = 0; // Exit the loop if successful
        } catch (error) {
            retries -= 1;
            console.error(`An error occurred (attempt ${3 - retries}):`, error.message);

            // Add delay before retrying
            if (retries > 0) {
                console.log("Retrying...");
                await new Promise(res => setTimeout(res, 3000)); // 3-second delay
            } else {
                console.log("Max retries reached. Moving to the next user.");
            }
        } finally {
            if (driver) await driver.quit();
        }
    }
};

export default WebScrapper;