import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

export const GroceriesList = (props) => {
    const { groceries, deleteGrocery } = props;
    const sortedGroceries = _.sortBy(groceries, "name");

    const renderGroceries = grocery => {
        return (
            <div className="row center-align">
                <span className="orange  accent-4 col s8 m5 l4 offset-s2 offset-m1">{grocery.name.charAt(0).toUpperCase()}{grocery.name.slice(1).toLowerCase()}</span>
                <span className="orange  accent-4 col s8 m5 l4 offset-s2 offset-l1">{grocery.quantity}</span>
                <button className="col s2 l2 offset-s5 offset-l1 waves-effect waves-light btn indigo darken-4 delete-btn" onClick={() => { deleteGrocery(grocery.name) }}>
                    <i className="material-icons">delete</i>
                </button>
            </div>
        );
    };

    return (
        <div>
            <h3>Groceries list:</h3>
            {sortedGroceries.map(grocery => {
                return (
                    <div key={grocery.name}>
                        {renderGroceries(grocery)}
                    </div>
                );
            })}
        </div>
    );
}

GroceriesList.defaultProps = {
    groceries: []
}

GroceriesList.propTypes = {
    groceries: PropTypes.array,
    deleteGrocery: PropTypes.func
}