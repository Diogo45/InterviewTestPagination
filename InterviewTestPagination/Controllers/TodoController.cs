using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;

namespace InterviewTestPagination.Controllers {
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/>
    /// model.
    /// 
    /// TODO: implement the pagination Action
    /// </summary>
    public class TodoController : ApiController {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo> _todoService = new TodoService();

        [HttpGet]
        public IEnumerable<Todo> Todos(/* parameters  */) {
            return _todoService.List();
        }

        [HttpGet]
        public IEnumerable<Todo> Filtered(int page, int page_size, string order_by)
        {

            var filtered_result = _todoService.List().Skip(page_size * page).Take(page_size);

            switch (order_by)
            {
                case "Id":
                    filtered_result = filtered_result.OrderBy(todo => todo.Id);
                    break;
                case "Task":
                    filtered_result = filtered_result.OrderBy(todo => todo.Task);
                    break;
                case "CreatedDate":
                    filtered_result = filtered_result.OrderBy(todo => todo.CreatedDate);
                    break;
                default:
                    filtered_result = filtered_result.OrderBy(todo => todo.Id);
                    break;

            }

            return filtered_result;

        }

    }
}
