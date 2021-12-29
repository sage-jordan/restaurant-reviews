import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams, useNavigate } from "react-router-dom";


const Restaurant = props => {
    let params = useParams();
    let navigate = useNavigate();
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: []
    };
    const [restaurant, setRestaurant] = useState(initialRestaurantState);

    const getRestaurant = id => {
        RestaurantDataService.get(id)
            .then(res => {
                setRestaurant(res.data);
                console.log(res.data);
            }).catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getRestaurant(params.id);
    }, [params.id]);

    const deleteReview = (reviewId, index) => {
        console.log("this: ", reviewId, props.user.id)
        RestaurantDataService.deleteReview(reviewId, props.user.id)
            .then(res => {
                setRestaurant((prevState) => {
                    prevState.reviews.splice(index, 1);
                    console.log(prevState.reviews)
                    return ({ ...prevState });
                })
            }).catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            {restaurant ? (
                <div>
                    <h5>{restaurant.name}</h5>
                    <p>
                        <strong>Cuisine: </strong>{restaurant.cuisine}<br></br>
                        <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
                    </p>
                    <Link to={"/restaurants/" + params.id + "/review"} className="btn btn-primary">
                        Review
                    </Link>
                    <h4>Reviews</h4>
                    <div className="row">
                        {restaurant.reviews.length > 0 ? (
                            restaurant.reviews.map((review, index) => {
                                console.log("review: ", review)
                                return (
                                    <div className="col-lg-4 pb-1" key={index}>
                                        <div className="card">
                                            <div className="card-body">
                                                <p className="card-text">
                                                    {review.text}
                                                </p>
                                                <p>
                                                    <strong>User: </strong>{review.name}<br></br>
                                                    <strong>Date: </strong>{review.date}
                                                </p>
                                                {props.user && props.user.id === review.user_id &&
                                                    <div className="row">
                                                        <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">
                                                            Delete
                                                        </a>
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    "/restaurants/" + params.id + "/review",
                                                                    { state: { currentReview: restaurant.reviews[index] } }
                                                                )}
                                                            className="btn btn-primary col-lg-5 mx-1 mb-1">
                                                            Edit
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div>
                                <p>No reviews.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <p>No restaurant selected.</p>
                </div>
            )}
        </div>
    );
};

export default Restaurant;
