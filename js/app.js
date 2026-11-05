// ITCS333 A3: to-do list app
// all the code is inside this IIFE so nothing ends up on window
(function () {
  'use strict';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var errorMsg = document.getElementById('error-msg');
  var list = document.getElementById('todo-list');
  var counter = document.getElementById('counter');
  var filters = document.querySelector('.filters');

  // which filter is active: 'all', 'active' or 'done'
  var currentFilter = 'all';

  function showError(show) {
    errorMsg.classList.toggle('hidden', !show);
  }

  // makes the <li> with the text and a delete button.
  // textContent so whatever is typed can't turn into real html
  function createItem(text) {
    var li = document.createElement('li');

    var span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = text;

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete-btn';
    del.textContent = 'Delete';

    li.appendChild(span);
    li.appendChild(del);
    return li;
  }

  // goes through the list once: hides what the current filter doesn't
  // want and counts the items that aren't completed.
  // I use style.display because the css has "#todo-list li { display: flex }"
  // and that beats the .hidden class
  function render() {
    var left = 0;
    for (var i = 0; i < list.children.length; i++) {
      var li = list.children[i];
      var done = li.classList.contains('completed');
      if (!done) {
        left++;
      }
      var visible =
        currentFilter === 'all' ||
        (currentFilter === 'active' && !done) ||
        (currentFilter === 'done' && done);
      li.style.display = visible ? '' : 'none';
    }
    counter.textContent = left + (left === 1 ? ' item left' : ' items left');
  }

  function setFilter(name) {
    currentFilter = name;
    render();
  }

  // add button and Enter both end up here
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (text === '') {
      showError(true);
      return;
    }
    showError(false);
    list.appendChild(createItem(text));
    input.value = '';
    input.focus();
    render();
  });

  // hide the error again once they start typing
  input.addEventListener('input', function () {
    showError(false);
  });

  // only one click listener, on the ul. clicks on the items bubble up to it
  // and closest() tells me if it was the delete button or the text.
  // this way items added later work without any extra code
  list.addEventListener('click', function (event) {
    var target = event.target;

    var delBtn = target.closest('.delete-btn');
    if (delBtn && list.contains(delBtn)) {
      list.removeChild(delBtn.closest('li'));
      render();
      return;
    }

    var li = target.closest('li');
    if (li && list.contains(li) && target.closest('.item-text')) {
      li.classList.toggle('completed');
      render();
    }
  });

  // same idea for the three filter buttons, one listener on their container
  filters.addEventListener('click', function (event) {
    var btn = event.target.closest('button');
    if (!btn) {
      return;
    }
    if (btn.id === 'filter-all') {
      setFilter('all');
    } else if (btn.id === 'filter-active') {
      setFilter('active');
    } else if (btn.id === 'filter-done') {
      setFilter('done');
    }
  });

  render();
})();
