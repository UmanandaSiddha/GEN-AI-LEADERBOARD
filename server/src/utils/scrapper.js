import { Builder, By } from 'selenium-webdriver';
import User from './user.model.js';

const WebScrapper = async (url) => {
    let driver = await new Builder().forBrowser('chrome').build();

    try {

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
                profileData.avatar = await driver.findElement(By.className('profile-avatar')).getAttribute('src');
                profileData.memberSince = await driver.findElement(By.className('ql-body-large')).getText();
        
                const leagueElement = await driver.findElement(By.className('profile-league'));
                profileData.league = await leagueElement.findElement(By.className('ql-headline-medium')).getText();
                profileData.body = await leagueElement.findElement(By.css('strong')).getText();
                profileData.points = Number(profileData.body.split(" ")[0]);
                profileData.leagueImage = await leagueElement.findElement(By.css('img')).getAttribute('src');
        
                const badgeElements = await driver.findElements(By.className('profile-badge'));
                profileData.profileBadges = [];
        
                for (let badgeElement of badgeElements) {
                    const title = await badgeElement.findElement(By.className('ql-title-medium')).getText();
                    const earnedDate = await badgeElement.findElement(By.className('ql-body-medium')).getText();
                    const extractedDateString = earnedDate.split(' ')[1] + ' ' + earnedDate.split(' ')[2] + ' ' + earnedDate.split(' ')[3];
                    const timeDate = new Date(extractedDateString);
                    const badgeImage = await badgeElement.findElement(By.css('img')).getAttribute('src');
        
                    profileData.profileBadges.push({ title, earned: earnedDate, time: timeDate, image: badgeImage });
                }
            } catch (error) {
                console.log("Some field are not present:", error.message)
            }

            await User.findOneAndUpdate(
                { publicProfile: url },
                {
                    profile: {
                        userName: profileData.username,
                        avatar: profileData.avatar,
                        member: profileData.memberSince
                    },
                    league: {
                        title: profileData.league,
                        body: profileData.body,
                        points: profileData.points,
                        image: profileData.leagueImage
                    },
                    badges: profileData.profileBadges
                },
                { new: true, runValidators: true, useFindAndModify: false }
            );
            console.log(JSON.stringify(profileData, null, 4));
        }

    } catch (error) {
        console.error("An error occurred while trying to open the webpage:", error.message);
    } finally {
        await driver.quit();
    }
}

export default WebScrapper;
