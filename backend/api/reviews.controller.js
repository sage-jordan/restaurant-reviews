import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.restaurant_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()

            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            )
            reviewResponse.error ? res.json({
                status: "error",
                reviewReq: {
                    restaurantId,
                    userInfo,
                    review,
                    date,
                },
                reviewDoc: reviewResponse.reviewDoc ? reviewResponse.reviewDoc : null
            }) : res.json({
                status: "success",
                reviewResponse: reviewResponse
            })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                text,
                date
            )

            if (reviewResponse) {
                if (reviewResponse.error) {
                    res.status(400).json({ error })
                } else if (reviewResponse.modifiedCount === 0) {
                    throw new Error(
                        "unable to update review - user may not be original poster",
                    )
                }
            }
            res.status(200).json({
                status: "review updated", review: {
                    reviewId,
                    userId: req.body.user_id,
                    text,
                    date
                }
            })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id
            const userId = req.query.user_id
            if (!reviewId || !userId) {
                res.status(404).json({ status: "Please supply an id and user_id in the query string" })
                return
            }
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId, userId
            )
            if (reviewResponse.deletedCount === 0) {
                res.status(404).json({ status: `Unable to find review with id: ${reviewId}`, reviewResponse })
            } else {
                res.json({ status: "success, deleted review", reviewResponse })
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}