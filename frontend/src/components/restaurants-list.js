import React, { useEffect, useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = props => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);

    useEffect(() => {
        retreiveRestaurants();
        retreiveCuisines();
    }, []);

    const onChangeSearchName = e => {
        const searchName = e.target.value;
        setSearchName(searchName);
    }

    const onChangeSearchZip = e => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };

    const onChangeSearchCuisine = e => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
        console.log("searchCuisine: ", searchCuisine);
    };

    const retreiveRestaurants = () => {
        RestaurantDataService.getAll()
            .then(res => {
                console.log(res);
                setRestaurants(res.data.restaurants);
            }).catch(e => {
                console.log(e);
            });
    };

    const retreiveCuisines = () => {
        RestaurantDataService.getCuisines()
            .then(res => {
                console.log(res.data);
                setCuisines(["All Cuisines"].concat(res.data));
            }).catch(e => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retreiveRestaurants();
    }

    const find = (query, by) => {
        RestaurantDataService.find(query, by)
            .then(res => {
                console.log(res.data);
                setRestaurants(res.data.restaurants);
            }).catch(e => {
                console.log(e);
            });
    };

    const findByName = () => {
        find(searchName, "name");
    };

    const findByZip = () => {
        find(searchZip, "zipcode");
    };

    const findByCuisine = () => {
        if (searchCuisine === "All Cuisines") {
            console.log("refreshing")
            refreshList();
        } else {
            console.log("finding: ", searchCuisine);
            find(searchCuisine, "cuisine");
        };
    };

    return (
        <div className="row pb-1">
            <div className="input-group col-lg-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={onChangeSearchName}
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={findByName}
                    > Search </button>
                </div>
            </div>
            <div className="input-group col-lg-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by zip"
                    value={searchZip}
                    onChange={onChangeSearchZip}
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={findByZip}
                    > Search </button>
                </div>
            </div>
            <div className="input-group col-lg-4">
                <select onChange={onChangeSearchCuisine}>
                    {cuisines.map(cuisine => {
                        return (
                            <option value={cuisine}>
                                {cuisine.substr(0, 20)}
                            </option>
                        )
                    })}
                </select>
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={findByCuisine}
                    > Search </button>
                </div>
            </div>
            <div className="row">
                {restaurants.map((restaurant) => {
                    const address = `${restaurant.address.building} ${restaurant.address.street} ${restaurant.address.zipcode}`;
                    return (
                        <div className="col-sm center py-1">
                            <div className="card border-primary px-2 mx-1" style={{ "min-width": "15rem", "min-height": "15rem" }}>
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text">
                                        <strong>Cuisine: </strong>{restaurant.cuisine}<br />
                                        <strong>Address: </strong>{address}
                                    </p>
                                    <div className="">
                                        <Link to={"/restaurants/" + restaurant.id} className="btn btn-primary col-lg-7 mx-1 mb-1">
                                            View Reviews
                                        </Link>
                                        <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-7 mx-1 mb-1">
                                            View Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    );
}

export default RestaurantsList;
