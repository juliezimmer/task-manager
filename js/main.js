
// Use ES6
//make sure this file is sourced in index.html
//when the page document loads, the jquery will run.
/* when the jquery runs, getTasks() is called and the DOM is loaded with all the tasks that have been created. */
$(document).ready(function(){
    getTasks(); 
    getCategoryOptions();
    
  //event handler for submit events
  //when addTask submit button is clicked, run the addTask() function.
    $('#add_task').on('submit' , addTask); 
    $('#edit_task').on('submit' , editTask); 
    
  //event for when Edit button is clicked
  //When the edit button is clicked, run the setTask() function.
    $('body').on('click', '.btn-edit-task', setTask);
});

//mLab data API Key
const apiKey = "-W8VhtL4pBHmuuq_qTPey8YbooNJPnRc";

/*getTasks() that loads the DOM with all the tasks in the DB.
  -This involves the mLab Data API and the key variable above.
  -Inside the getTasks() function, there will be an AJAX call to the mLab API.
  -jquery is used to iterate over the collectio og objects that the API returns   from the database.
  -Tasks, the collection from the taskmanager db, is returned as an array with 1  object in it right now.
  -Each object is a task with properties and values.  */
function getTasks() {
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey='+apiKey, function(data){
    //output is the list of tasks from the collection.
    //'<ul class="list-group">'; is where the task list will be on the DOM.
    var output = '<ul class="list-group">';
    /*jQuery each loop will output each task from the collection and put it on     the DOM in a <li>.
      -"data" is the collection pulled from the database. */
    $.each(data, function(key, task) { 
      /*output is the list of tasks 
        -The list isn't replaced, but each task is added to the list, to += is    used to increase the length of the list with each task added.
        -Each task that is added is put in an <li> tag. 
        -This appends each task to the DOM. 
        -task.task_name is the task in each document in the collection.
        -task.due_date is the date when the task should be done. 
        -These are both properties in each document in collection. 
        -Each <li> in the list will have the task name followed by its due        date. */
        output += '<li class="list-group-item">'; 
        output += task.task_name+'<span class="due_on">[Due on '+task.due_date+']</span>'
        //task.is_urgent is a property is each document in the collection. 
        if (task.is_urgent == "true") {/* if task.is_urgent is true, a red label with "urgent" is added to the task line in the list. */
            output += '<span class="label label-danger">Urgent</span>';
        } 
      /*This adds edit and delete buttons after each task that is put on the DOM. These buttons are added dynamically. */ 
        output +='<div class="pull-right"> <a class="btn btn-primary btn-edit-task" data-task-name="'+task.task_name+'" data-task-id="'+task._id.$oid+'">Edit</a> <a class="btn btn-danger" href="#">Delete</a> </div>'; 
    });
    output += '</ul>' /* When the tasks are done being put on the DOM, all items in array are done being iterated, add the closing <ul> tag as the last thing to append. */
    $('#tasks').html(output);
  });
}

function addTask(e){
  var task_name = $('#task_name').val();  
  var category = $('#category').val();
  var due_date = $('#due_date').val();
  var is_urgent = $('#is_urgent').val();

  //AJAX POST request
  //url is the mLab Data API url
  $.ajax({
    url:'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey='+apiKey, 
    data: JSON.stringify({
      "task_name": task_name,
      "category" : category,
      "due_date": due_date,
      "is_urgent": is_urgent
    }),
    type:'POST',
    contentType: 'application/json',
    success: function(data) {
      //if the post request is successful, redirect user to index.html. 
      window.location.href='index.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
}

// ***************** setTask() function *********************** //
function setTask() {
  var task_id = $(this).data('task-id');
  //this is asking for the data attribute: data-task-id.
  console.log("data-task-id is: ", task_id);
  
  //This task_id needs to be set to sessionStorage (local storage).
  //This sets the current_id to the task_id variable.
  sessionStorage.setItem('current_id', task_id);
  
  //redirect to the edit page
  window.location.href='editTask.html';
  return false; 
}

// ****************** getTask() function *********************//
/*This functions fetches the task that needs to be edited and makes it available for editing. */
function getTask() {
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/'+id+'?apiKey='+apiKey, function(task){
      $('#task_name').val(task.task_name);
      $('#category').val(task.category);
      $('#due_date').val(task.due_date);
      $('#is_urgent').val(task.is_urgent);
  });
}

// ***************** editTask() function ********************** //
function editTask(e) {
  var task_id = sessionStorage.getItem('current_id');
  var task_name = $('#task_name').val();  
  var category = $('#category').val();
  var due_date = $('#due_date').val();
  var is_urgent = $('#is_urgent').val();

  $.ajax({
    url:'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/'+task_id+'?apiKey='+apiKey, 
    data: JSON.stringify({
      "task_name": task_name,
      "category" : category,
      "due_date": due_date,
      "is_urgent": is_urgent
    }),
    type:'PUT',
    contentType: 'application/json',
    success: function(data) {
      //if the post request is successful, redirect user to index.html. 
      window.location.href='index.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
}

function getCategoryOptions() {
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey, function(data){
    var output;
    
    $.each(data, function(key, category) { 
        output += '<option value="'+category.category_name+'">'+category.category_name+'</option>';
    });
    output += '</ul>'; 
    $('#category').append(output);
  });
}
