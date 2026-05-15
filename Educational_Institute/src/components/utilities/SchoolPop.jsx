import { Dialog } from "@mui/material";
import React from "react";

export default function SchoolPop(props) {

    const {
        openStatus,
        popUpMenuOpenHandle,
        popUpMenuCloseHandle,
        setPopUpMenuOptions,
        popUpMenuOptions,
        applyDelay,
        applyClear,
    } = props;

    const setUpdatedValues = (event) => {
        const {value,name} = event.target;
        setPopUpMenuOptions(name, value)

    }

    return (
        <div>
        <Dialog 
            onClose={popUpMenuCloseHandle} 
            open={openStatus} 
            fullWidth
            maxWidth="sm"
        >
            <div className="main-pop-con">
                <div className="advanced-filter-head">
                    <div>
                        <span>Advanced filters</span>
                        <p>Fine tune results by operating hours, distance, and experience range.</p>
                    </div>
                    <button type="button" onClick={popUpMenuCloseHandle} className="close-pop-menu">
                        Close
                    </button>
                </div>
                <div className="pop-menu-items">
                    <div className="advanced-field pop-menu-openeing-time">
                        <label>Opening Time</label>
                        <input 
                            type="time" 
                            name="opening-time"
                            value={popUpMenuOptions['opening-time']}
                            onChange={setUpdatedValues}
                        />
                    </div>
                    <div className="advanced-field pop-menu-closing-time">
                        <label>Closing Time</label>
                        <input 
                            type="time" 
                            name="closing-time"
                            value={popUpMenuOptions['closing-time']}
                            onChange={setUpdatedValues}
                        />
                    </div>
                    <div className="advanced-field pop-menu-distance">
                        <label>Distance</label>
                        <select 
                            name="distance"
                            className="pop-menu-distance"
                            onChange={setUpdatedValues}
                            value={popUpMenuOptions['distance']}
                        >
                            <option value="Near">Near</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Distant">Distant</option>
                        </select>
                    </div>
                    <div className="advanced-field pop-menu-range-exp">
                        <label>Experience Range</label>
                        <div className="range-inputs">
                            <input 
                                type="number" 
                                value={popUpMenuOptions['experience-start']} 
                                name="experience-start"
                                placeholder="Min"
                                onChange={setUpdatedValues}/>
                            <input 
                                type="number" 
                                value={popUpMenuOptions['experience-end']} 
                                name="experience-end"
                                placeholder="Max"
                                onChange={setUpdatedValues}/>
                        </div>
                    </div>
                </div>
                <div className="pop-menu-div">
                        <button type="button" onClick={applyClear} className="apply-pop-clear">
                            Clear filters
                        </button>
                        <button type="button" onClick={applyDelay} className="apply-pop-menu">
                            Apply
                        </button>
                </div>
            </div>
        </Dialog>
      </div>
    );
}
