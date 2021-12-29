import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";

const AddReview = props => {
    let params = useParams();
    let location = useLocation();
    let initialReviewState = "";
    let editing = false;
    console.log("location: ", location)
    if (location.state && location.state.currentReview) {
        editing = true;
        initialReviewState = location.state.currentReview.text;
    }

    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        setReview(event.target.value);
    };

    const saveReview = () => {
        var data = {
            text: review,
            name: props.user.name,
            user_id: props.user.id,
            restaurant_id: params.id
        };

        if (editing) {
            data.review_id = location.state.currentReview._id
            RestaurantDataService.updateReview(data)
                .then(res => {
                    setSubmitted(true);
                    console.log(res.data);
                }).catch(e => {
                    console.log(e);
                })
        } else {
            RestaurantDataService.createReview(data)
                .then(res => {
                    setSubmitted(true);
                    console.log(res.data);
                }).catch(e => {
                    console.log(e);
                })
        }
    }
    return (
        <div>
            {props.user ? (
                <div className="submit-form">
                    {submitted ? (
                        <div>
                            <h4>You submitted successfully!</h4>
                            <Link to={"/restaurants/" + params.id} className="btn btn-primary">
                                Back to Restaurant
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="form-group">
                                <label htmlFor="description">
                                    {editing ? "Edit" : "Create"} Review
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="text"
                                    required
                                    value={review}
                                    onChange={handleInputChange}
                                    name="text"
                                />
                            </div>
                            <button onClick={saveReview} className="btn btn-success">
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    Please log in.
                </div>
            )}
        </div>
    );
}

export default AddReview;
