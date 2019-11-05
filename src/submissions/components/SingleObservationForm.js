import React, { useState, Fragment, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function SingleObservationForm() {
  // STATION CONDITIONS
  // Defaults to 9999 for users who don't have a station number
  const [station, setStation] = useState(9999);
  const [cloudedOut, setCloudedOut] = useState(false);
  const [observerUnavailable, setObserverUnavailable] = useState(false);
  // date, time and time uncertainty
  const [date, setDate] = useState("20191103");
  const [time, setTime] = useState("112233444");
  const [timeUncertainty, setTimeUncertainty] = useState(15);
  const [conditions, setConditions] = useState("B");
  // OBJECT POSITION
  const [object, setObject] = useState("12345 98 123LEO");
  const [angleFormatCode, setAngleFormatCode] = useState(5);
  const [epochCode, setEpochCode] = useState(6);
  // right ascension OR azimuth
  const [rightAscensionOrAzimuth, setRightAscensionOrAzimuth] = useState(
    1122334
  );
  // declinatiion OR Elevation
  const [declinationOrElivation, setDeclinationOrElevation] = useState(
    `+112233`
  );
  // positional uncertainty
  const [positionalUncertainty, setPositionalUncertainty] = useState(46);
  // BEHAVIOR
  // Behavior, Brightness and Conditions
  const [flashPeriod, setFlashPeriod] = useState(` 10000`);
  // AKA visual magnitude
  const [brightness, setBrightness] = useState(`070`);
  const [magnitudeUncertainty, setMagnitudeUncertainty] = useState("10");
  const [behavior, setBehavior] = useState("H");
  const [visualMagnitudeSign, setVisualMagnitudeSign] = useState("+");

  // The IOD string to be updated.
  const [IOD, setIOD] = useState("");

  useEffect(() => {
    setIOD(
      `${object} ${station} ${conditions} ${date}${time} ${timeUncertainty} ${angleFormatCode}${epochCode} ${rightAscensionOrAzimuth}${declinationOrElivation} ${positionalUncertainty} ${behavior}${visualMagnitudeSign}${brightness} ${magnitudeUncertainty} ${flashPeriod}`
    );
  }, [
    object,
    station,
    conditions,
    date,
    time,
    timeUncertainty,
    angleFormatCode,
    epochCode,
    rightAscensionOrAzimuth,
    declinationOrElivation,
    positionalUncertainty,
    behavior,
    visualMagnitudeSign,
    brightness,
    magnitudeUncertainty,
    flashPeriod
  ]);

  const handleSubmit = () => {
    console.log({
      date,
      time,
      object,
      behavior,
      brightness,
      conditions
    });
  };

  const today = new Date();
  const maxDate = `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}`;

  return (
    <Fragment>
      <p style={{ color: "orange" }}>{IOD}</p>
      <form
        className="single-observation-form"
        onSubmit={event => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        {/* STATION CONDITIONS */}
        <section className="station-conditions__section">
          <h2 className="station-conditions__heading">STATION CONDITIONS</h2>
          <div className="station-conditions__location-checkbox-wrapper">
            <div className="station-conditions__location-wrapper">
              <label>Station Location</label>
              <input
                type="number"
                value={station}
                onChange={event => setStation(event.target.value)}
              />
            </div>
            {/* checkboxes */}
            <div className="station-conditions__checkbox-wrapper">
              <label>
                <input type="checkbox" value={cloudedOut}></input>
                Clouded Out
              </label>
              <label>
                <input type="checkbox" value={observerUnavailable}></input>
                Observer Unavailable
              </label>
            </div>
          </div>
          {/* Date, time and time uncertainty */}
          <div className="station-conditions__date-time-wrapper">
            <div>
              <label>Time of observation</label>
              <div>
                <input
                  className=""
                  type="date"
                  onChange={event => {
                    console.log(event.target.value);
                    setDate(event.target.value.replace(/-/g, ""));
                  }}
                  max={maxDate}
                />
                <input
                  className=""
                  onChange={event => setTime(event.target.value)}
                  value={time}
                  placeholder="HHMMSSsss"
                />
              </div>
            </div>
            <div className="station-conditions__time-uncertainty-wrapper">
              <label>Time uncertainty</label>
              <select></select>
            </div>
          </div>
          {/* Conditions */}
          <div className="station-conditions__conditions-wrapper">
            <label>Conditions (optional)</label>
            <div className="station-conditions__conditions-buttons-wrapper">
              <span
                className="station-conditions__button"
                onClick={() => setConditions("E")}
              >
                Excellent
              </span>
              <span
                className="station-conditions__button"
                onClick={() => setConditions("G")}
              >
                Good
              </span>
              <span
                className="station-conditions__button"
                onClick={() => setConditions("F")}
              >
                Fair
              </span>
              <span
                className="station-conditions__button"
                onClick={() => setConditions("P")}
              >
                Poor
              </span>
              <span
                className="station-conditions__button"
                onClick={() => setConditions("B")}
              >
                Bad
              </span>
              <span
                className="station-conditions__button"
                onClick={() => setConditions("T")}
              >
                Terrible
              </span>
            </div>
          </div>
        </section>

        <section className="object-position__section">
          <h2 className="object-position__heading">OBJECT POSITION</h2>
          {/* Object name/number */}
          <div className="object-position__object-wrapper">
            <input
              className="object-position__object-input"
              type="text"
              onChange={event => setObject(event.target.value)}
              value={object}
              placeholder="Object"
            />
          </div>

          {/* Right ascension and declination */}
          <div className="single-observation-form__ascension-declination-wrapper">
            <div>
              <p>Right ascension</p>
              <input
                type="number"
                onChange={event =>
                  setRightAscensionOrAzimuth(event.target.value)
                }
                value={rightAscensionOrAzimuth}
                placeholder="HHMMSS"
              />
            </div>
            <div>
              <p>Declination</p>
              <input
                type="number"
                onChange={event =>
                  setDeclinationOrElevation(event.target.value)
                }
                value={declinationOrElivation}
                placeholder="HHMMSS"
              />
            </div>
          </div>
        </section>

        {/* Behavior and Brightness */}
        <div className="single-observation-form__behavior-brightness-wrapper">
          <div className="single-observation-form__behavior-select-wrapper">
            <p>Behavior</p>
            <select
              className="single-observation-form__behavior-select"
              onChange={event => setBehavior(event.target.value)}
              placeholder="Behavior"
              selected={behavior}
              defaultValue={"choose"}
            >
              <option value="choose" disabled hidden></option>
              <option value="E">
                Unusually faint because of eclipse exit/entrance
              </option>
              <option value="F">Constant flash period</option>
              <option value="I">Irregular</option>
              <option value="R">Regular variations</option>
              <option value="S">Steady</option>
              <option value="X">Irregular flash period</option>
              <option value="B">
                Time zero for averaging several flash cycles
              </option>
              <option value="H">One flash in a series</option>
              <option value="P">
                end time for averaging several flash cycles. Time interval from
                last "B" report divided by flash period reported on this line
                gives number of flashes that occurred since "B".
              </option>
              <option value="A">
                became visible (was invisible); use E for eclipse exit
              </option>
              <option value="D">
                Object in field of view, but not visible
              </option>
              <option value="M">Brightest</option>
              <option value="N">Faintest</option>
              <option value="V">Best seen using averted vision</option>
            </select>
          </div>
          <div className="single-observation-form__brightness-input-wrapper">
            <p>Brightness</p>
            <input
              className="single-observation-form__brightness-input"
              type="number"
              onChange={event => setBrightness(event.target.value)}
              value={brightness}
            />
          </div>
        </div>

        {/* Cancel and Submit buttons */}
        <div className="single-observation-form__button-wrapper">
          <NavLink className="app__nav-link" to="/catalog/priorities">
            <span className="app__black-button--small single-observation-form__cancel-button">
              CANCEL
            </span>
          </NavLink>
          &nbsp;
          <button type="submit" className="app__white-button--small">
            SUBMIT
          </button>
        </div>
      </form>
    </Fragment>
  );
}

// QUESTIONS
// 1. what is format for date
// 2. what is format for time
// 3. What is the format for object? and will we use API to search database for object names/numbers?
// 4. what are the options for 'behavior' and how are they formatted
// 5. How is conditions formatted
// 6. What inputs are mandatory?
