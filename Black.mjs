export default async function start() {
    const fetch = (await import('node-fetch')).default;
    const { scheduleJob } = await import('node-schedule');
    const fetchBlacklist = async () => {
        let blacklist = await redis.get('YH:blacklist');
        if (!blacklist) {
            const response = await fetch('https://gitee.com/DenFengLai/black-list/raw/master/Black.json');
            const blacklistData = await response.json();
            blacklist = JSON.stringify(blacklistData.blacklist);
            await redis.set('YH:blacklist', blacklist, { EX: 200 });
        }
        return JSON.parse(blacklist);
    };

    const checkAndKick = async () => {
        try {
            const blacklist = await fetchBlacklist();
            const groups = [...Bot.gl.keys()];
            const groupMembers = await Promise.all(groups.map(async group => {
                try {
                    const memberMap = await Bot.pickGroup(group, true).getMemberMap();
                    return { group, memberMap };
                } catch {
                    return null;
                }
            }));
            for (const { group, memberMap } of groupMembers.filter(Boolean)) {
                for (const [id] of memberMap) {
                    if (blacklist.includes(id.toString())) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await Bot.pickGroup(group).kickMember(id).catch();
                    }
                }
            }
        } catch {}
    };

    const Deal = async (e) => {
        try {
            const blacklist = await fetchBlacklist();
            if (blacklist.includes(e.user_id.toString())) {
                const kicked = await Bot.pickGroup(e.group_id).kickMember(e.user_id);
                if (!kicked) {
                    e.msg = '';
                    e.user_id = 0;
                }
            }
        } catch {}
    };

    scheduleJob('*/10 * * * *', checkAndKick); //定时任务
    Bot.on('message.group', Deal);
}
