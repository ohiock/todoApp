(function() {
	var App = {};

	App = {
		/*-----
			Function: Initializes the application
		-----*/
		init: function() {
			var button = document.getElementById('add-task');
			button.addEventListener('click', App.createTask);

			document.onkeydown = function(e) {
				if(e.which == 13) { // if 'enter' is pressed
					App.createTask(); // add new task
				}
			}

			document.addEventListener('mousemove', App.moveTask);

			App.getAllTasks();
		},

		data: ['Clean my room', 'Do laundry', 'Cook dinner', 'Do my homework'],

		/*-----
			Variable: States whether the task is moving or not
		-----*/
		moving: false,

		/*-----
			Variable: The task element that is being moved
		-----*/
		element: '',

		/*-----
			Function: Gets all tasks
		-----*/
		createTask: function() {
			var input = document.getElementById('new-task');
			if(input.value !== '') { // if the textbox is not empty
				App.data.push(input.value); // add new task to data array
				input.value = ''; // clear textbox

				App.getAllTasks(); // refresh the list
			}
		},

		/*-----
			Function: Gets all tasks
		-----*/
		getAllTasks: function() {
			var list = document.getElementById('list'); // gets the container element
			list.innerHTML = ''; // resets the list to nothing

			for(var i = 0; i < App.data.length; i++) { // loop through array that contains tasks
				var task = document.createElement('li'); // create element
				task.className = 'task'; // add class
				task.setAttribute('data-id', i); // add data attribute
				task.innerHTML = '<div class="delete">x</div><div class="text"> #' + (i + 1) + ': ' + App.data[i] + '</div>'; // set contents of <li> to string
				
				task.children[0].addEventListener('click', App.deleteTask); // add 'click' listner to trigger task deletion

				task.children[1].addEventListener('mousedown', function(e) { // if text is clicked
					e.target.parentNode.className += ' moving'; // add class moving

					App.moving = true; // the task is now moving
					App.element = e.target.parentNode;
				});

				task.children[1].addEventListener('mouseup', function(e) {
					e.target.parentNode.className = 'task'; // remove 'moving' class that was added previously

					App.moving = false; // task is no longer moving
					App.adjustTaskOrder(e); // adjust the order of the task
				});

				list.appendChild(task); // append to list
			}
		},

		/*-----
			Function: Sets final task position
		-----*/
		moveTask: function(e) {
			if(App.moving == true) { // if task is being moved
				var task = App.element; // set task to be moved

				task.style.position = 'fixed'; // change element to fixed position
				task.style.top = e.clientY - 15 + 'px'; // set y coordinate
			}
		},

		/*-----
			Function: Determines which direction the task is going
		-----*/
		adjustTaskOrder: function(e) {
			var task = e.target.parentNode; // grab element that we need to move
			var displayedTasks = App.utility.getElementByAttribute('data-id'); // get all elements with 'data-id' attribute
			var id = parseInt(task.getAttribute('data-id')); // get task array id

			var contents = task.children[1].innerHTML; // get contents of task
			contents = contents.substr(5); // remove '#X: ' from string

			for(var i = 0; i < displayedTasks.length; i++) { // loop through all tasks
				if(task.offsetTop < displayedTasks[i].offsetTop) { // if the task being moved is higher than this displayed task
					App.data.splice(id, 1); // remove task from data array
					App.data.splice(i, 0, contents); // insert contents of task into array above the task that was lower
					
					break; // strop the loop since we found what we needed
				}
			}

			if(task.offsetTop > displayedTasks[(displayedTasks.length - 1)].offsetTop) { // if task is lower than all other tasks
				App.data.splice(id, 1); // remove task from data array
				App.data.push(contents); // insert contents of task into array at the end
			}

			App.getAllTasks(); // refresh the list
		},

		/*-----
			Function: Deletes a task
		-----*/
		deleteTask: function(e) {
			var task = e.target.parentNode; // grab parent of element clicked
			var id = parseInt(task.getAttribute('data-id')); // grab data-id to identify task in array
			
			App.data.splice(id, 1 ); // remove task from data array
			
			App.getAllTasks(); // refresh the list
		},

		utility: {
			/*-----
				Function: Grabs element based on attribute from the entire page
			-----*/
			getElementByAttribute: function(attribute) {
				var everything = document.getElementsByTagName('*'); // get all elements
				var matchingElements = []; // initialize new array

				for(var i = 0; i < everything.length; i++) { // loop through all the elements
					if(everything[i].getAttribute(attribute)) { // if the element has the attribute that we're looking for
						matchingElements.push(everything[i]); // add the element to the array of matches
					}
				}

				return matchingElements; // return the array of matched elements
			}	
		}
	}

	App.init(); // initialize the app
})();