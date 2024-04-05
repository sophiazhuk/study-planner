
const coursesUrl = 'courses_data.json';

fetch(coursesUrl)
  .then(response => response.json())
  .then(data => {
    initDragAndDrop(data);
  })
  .catch(error => console.error('Error fetching courses data:', error));

function initDragAndDrop(courses) {
  courses.forEach((course, index) => {
    const button = createCourseButton(course, index);
    // Determine the column based on the course category
    const column = document.querySelector(`.col.${course.category}`) || document.querySelector('.col.core');
    column.appendChild(button);
  });

  initializeDroppableCells();
}

function createCourseButton(course, index) {
  const button = document.createElement('button');
  button.className = `btn draggable m-1 ${getButtonClass(course.category)}`;
  button.id = `course-${index}`;
  button.draggable = true;
  button.addEventListener('dragstart', handleDragStart, false);

  const buttonText = document.createTextNode(`${course.course_code} `);
  button.appendChild(buttonText);

  const badge = document.createElement('span');
  badge.className = 'badge bg-light text-dark';
  badge.innerText = ` ${course.credits}`;
  button.appendChild(badge);

  return button;
}

function getButtonClass(category) {
  switch (category) {
    case 'core':
      return 'btn-danger';
    case 'elective':
      return 'btn-warning';
    case 'senior':
      return 'btn-purple';
    case 'science':
      return 'btn-success';
    default:
      return 'btn-secondary';
  }
}

function handleDragStart(e) {
  currentDraggedElement = e.target;
  e.dataTransfer.setData('text/plain', e.target.id);
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleCellDrop(e) {
  e.preventDefault();
  const targetCell = e.target.tagName === 'TD' ? e.target : e.target.closest('td');
  if (!targetCell || !currentDraggedElement) return;

  // Check if target cell already has a button
  if (targetCell.hasChildNodes()) {
    const existingButton = targetCell.childNodes[0];
    // Move existing button back to its original container based on its category
    const originalColumn = document.querySelector(`.col.${existingButton.getAttribute('data-category')}`) || document.querySelector('.col.core');
    originalColumn.appendChild(existingButton);
  }

  // Now, place the new (currentDraggedElement) button in the cell
  targetCell.appendChild(currentDraggedElement);

  currentDraggedElement.draggable = true;
  currentDraggedElement.addEventListener('dragstart', handleDragStart, false);

  currentDraggedElement = null;
}

// Modifications in createCourseButton to include data-category attribute
function createCourseButton(course, index) {
  const button = document.createElement('button');
  button.className = `btn draggable m-1 ${getButtonClass(course.category)}`;
  button.id = `course-${index}`;
  button.setAttribute('data-category', course.category); // Store the category for later use
  button.draggable = true;
  button.addEventListener('dragstart', handleDragStart, false);

  const buttonText = document.createTextNode(`${course.course_code} `);
  button.appendChild(buttonText);

  const badge = document.createElement('span');
  badge.className = 'badge bg-light text-dark';
  badge.innerText = ` ${course.credits}`;
  button.appendChild(badge);

  return button;
}

function initializeDroppableCells() {
  const cells = document.querySelectorAll('.plan td:not(.table-footer td)');
  cells.forEach(cell => {
    cell.addEventListener('dragover', handleDragOver, false);
    cell.addEventListener('drop', handleCellDrop, false);
  });
}