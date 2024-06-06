const { prisma } = require('../prisma/prisma-client');

const LikeController = {
    likePost: async (req, res) => {
        const { postId } = req.body;
        const userId = req.user.userId;

        if(!postId) {
            return res.status(400).json({ error: "All fields are required"})
        }

        try {
            const existingLike = await prisma.like.findFirst({
                where: {
                    postId,
                    userId
                }
            });

            if(existingLike) {
                return res.status(400).json({ error: 'You have already had a like' })
            }

            const like = await prisma.like.create({
                data: {
                    postId,
                    userId
                }
            })

            res.json(like)
        } catch (error) {
            console.log('Like post error ', error);
            res.status(500).json({ error: 'Internal server error'});
        }
    },
    unlikePost: async (req, res) => {
        const { postId } = req.params;
        const userId = req.user.userId;

        try {
            const existingLike = await prisma.like.findFirst({
                where: {
                    postId,
                    userId
                }
            });

            if(!existingLike) {
                return res.status(404).json({ error: 'You cannot dislike' })
            }

            if(existingLike.userId !== userId) {
                return res.status(403).json({ error: 'Forbidden' })
            }

            await prisma.like.deleteMany({
                where: {
                    postId,
                    userId
                }
            });

            res.json(existingLike)

        } catch (error) {
            console.log('Unlike post error ', error);
            res.status(500).json({ error: 'Internal server error'});
        }
    }
}

module.exports = LikeController;