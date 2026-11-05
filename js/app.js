// ITCS333 A3 — vanilla-JS to-do app.
// Everything lives inside one IIFE so nothing leaks into the global scope.
(function () {
  'use strict';

  var form = document.getElementById('todo-form');
  var input = document.getElementById('todo-input');
  var errorMsg = document.getElementById('error-msg');
  var list = document.getElementById('todo-list');
  var counter = document.getElementById('counter');
  var filters = document.querySelector('.filters');

  // 'all' | 'active' | 'done'
  var currentFilter = 'all';

  function showError(show) {
    errorMsg.classList.toggle('hidden', !show);
  }

  // Build one <li> with a text span and a delete button.
  // textContent (not innerHTML) so typed text is never parsed as HTML.
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

  // Show or hide each item for the current filter, then refresh the counter.
  // Inline style.display is used because "#todo-list li" in the CSS sets
  // display:flex and would beat the .hidden class.
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

  // 1 + 2: add an item, or show the error for an empty submission.
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

  // Clear the error as soon as the user starts typing again.
  input.addEventListener('input', function () {
    showError(false);
  });

  // 3 + 4: event delegation — ONE click listener on the list handles every
  // item, including items added later. closest() finds which part was clicked.
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

  // 5: filter buttons, also delegated through their container.
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

  // 6: initial counter.
  render();
})();
