const { prisma } = require('../prisma/prisma-client');

const FollowController = {
    followUser: async (req, res) => {
        const { followingId } = req.body;
        const userId = req.user.userId;

        if (!followingId) {
            return res.status(400).json({ error: "All fields are required"})
        }
        if (followingId === userId) {
            return res.status(500).json({ error: "You cannot subscribe on yourself!" })
        }

        try {
            const existingSubscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            })

            if(existingSubscription) {
                return res.status(400).json({ error: "Subscription already exists" })
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId }},
                    following: { connect: { id: followingId }}
                }
            })

            res.status(201).json({ message: "Subscription has been created"})
        } catch (error) {
            console.log('Follow error ', error);
            res.status(500).json({ error: 'Internal server error'});
        }

    },
    unfollowUser: async (req, res) => {
        const { followingId } = req.params;
        const userId = req.user.userId;

        try {
            const follows = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            })

            if(!follows) {
                return res.status(400).json({ error: "You are not follow this user"})
            }

            await prisma.follows.delete({
                where: { id: follows.id }
            })

            res.status(200).json({ message: 'You have successfully unfollowed this user'})
        } catch (error) {

        }
    }
}

module.exports = FollowController;