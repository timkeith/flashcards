import React from 'react';
import Button from 'react-bootstrap/Button';

const GroupPicker = ({ groups, handler }) => {
  const [selectedGroup, set_selectedGroup] = React.useState();
  const choices = groups.map((group, i) => (
    <div key={i}>
      <label>
        <input
          type='radio'
          value='{i}'
          checked={selectedGroup === group}
          onChange={() => set_selectedGroup(group)}
        />
        {group}
      </label>
    </div>
  ));
  return <>
    <div id='GroupPicker'>
      <h2>Choose Group of Decks</h2>
      <form>
        {choices}
        <Button
          variant='primary'
          disabled={selectedGroup === undefined}
          onClick={() => handler(selectedGroup)}>
          Next
        </Button>
      </form>
    </div>
  </>;
};
export default GroupPicker;
