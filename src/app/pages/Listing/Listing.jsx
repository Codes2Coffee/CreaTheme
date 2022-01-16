import React, { useState } from "react";
import "./Listing.scss";
import PlacesAutocomplete from "react-places-autocomplete";
import Button from "@material-ui/core/Button";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";

function Listing() {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  return (
    <div>
      <div className="wrap">
        <div className={open ? "blur clear" : "blur"}></div>
        <Button
          onClick={() => {
            setOpen(true);
            setDisabled(false);
          }}
          disabled={disabled}
        >
          open
        </Button>
        <Card className={open ? "tryCont tryContOpen" : "tryCont"}>
          <IconButton
            className="bb"
            aria-label="search"
            color="inherit"
            onClick={() => {
              setOpen(false);
              setDisabled(false);
            }}
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>

          {/* <Add /> */}
          {/* <Teacher /> */}
          {/* <CP /> */}
        </Card>
        {/* <div className={open ? "tryCont tryContOpen" : "tryCont"}>
          <IconButton
            className="bb"
            aria-label="search"
            color="inherit"
            onClick={() => {
              setOpen(false);
              setDisabled(false);
            }}
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>

          <Add />
          <Teacher />
          <CP />
        </div> */}
      </div>

      {/* <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "add location" })} />

            <div>
              {loading ? <div>loading...</div> : null}

              {suggestions.map((suggestion) => {
                return <div>{suggestion.description}</div>;
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete> */}
    </div>
  );
}

export default Listing;
