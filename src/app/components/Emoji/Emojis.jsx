import React from "react";
import PropTypes from "prop-types";
import { EmojiPickerContainer, EmojisContainer } from "./Emojistyle";

const Emojis = ({ pickEmoji, showEmoji }) => {
  return (
    <div style={showEmoji ? { display: "none" } : { display: "block" }}>
      <EmojisContainer>
        {<EmojiPickerContainer onEmojiClick={pickEmoji} />}
      </EmojisContainer>
    </div>
  );
};

Emojis.propTypes = {
  pickEmoji: PropTypes.func,
};

export default Emojis;
