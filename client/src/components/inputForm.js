import React from "react";
import PropTypes from "prop-types";

export const InputForm = props => {
    const { handleInputChange, newGroceryName, newGroceryQuantity, onAddButtonClick } = props;

    return (
        <div className="row">
            <form className="col s12">
                <div className="row">
                    <div className="input-field col s12 m12 l6 center-align">
                        <input
                            className="validate"
                            onChange={handleInputChange}
                            value={newGroceryName}
                            name="newGroceryName"
                            type="text"
                            placeholder="Enter grocery name"
                        />
                    </div>
                    <div className="input-field col s12 m12 l6 center-align">
                        <input
                            onChange={handleInputChange}
                            value={newGroceryQuantity}
                            name="newGroceryQuantity"
                            type="number"
                            min="1"
                            placeholder="Quantity"
                        />
                    </div>
                    <div className="col s12 center-align">
                        <button className="waves-effect waves-light btn indigo darken-4" onClick={onAddButtonClick}><i className="material-icons">add</i></button>
                    </div>
                </div>
                <div className="row">
                </div>
            </form>
        </div>
    );
}

InputForm.defaultProps = {
    newGroceryName: "",
    newGroceryQuantity: ""
}

InputForm.propTypes = {
    handleInputChange: PropTypes.func,
    onAddButtonClick: PropTypes.func,
    newGroceryName: PropTypes.string,
    newGroceryQuantity: PropTypes.string
}