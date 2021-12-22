import { json } from "express";
import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.cuising) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage
        })

        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)
    }

    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {}
            let restaurant = await RestaurantsDAO.getRestaurantById(id)
            if (!restaurant) {
                res.status(404).json({ error: "Restaurant not found" })
            }
            res.json(restaurant)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisine = await RestaurantsDAO.getCuisines()
            res.json(cuisine)
        } catch (e) {
            res.status(500).json({ error: e })
        }
    }
}