using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Core;
using SpaceY.DataAccess;
using SpaceY.Interface;

namespace SpaceY.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Controller for making equations accessible by clients.
    /// </summary>
    [Route("api/[controller]")]
    public class EquationsController : Controller
    {
        private EquationStore EquationStore { get; } = new EquationStore();

        /// <summary>
        /// Get list of all equations.
        /// </summary>
        [HttpGet]
        public IEnumerable<RestEquation> List()
        {
            return EquationStore
                  .Equations
                  .Select(equation =>
                       new RestEquation { Id = equation.Id, Equation = equation.Serialize() });
        }

        /// <summary>
        /// Get equation with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}")]
        public RestEquation Get(int id)
        {
            return EquationStore
                  .Equations
                  .Select(equation =>
                       new RestEquation { Id = equation.Id, Equation = equation.Serialize() })
                  .FirstOrDefault(equation => equation.Id == id) ??
                   throw new ArgumentException(nameof(id));
        }

        /// <summary>
        /// Get the value of equation with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}/[action]")]
        public object Evaluate(int id, RestEquationParam[] parameters)
        {
            return EquationStore
                  .Equations
                  .FirstOrDefault(equation => equation.Id == id)
                 ?.Evaluate(parameters) ??
                   throw new ArgumentException(nameof(id));
        }

        /// <summary>
        /// Compute the value of an equation with the specified or default parameters.
        /// </summary>
        [HttpPost("[action]")]
        public object Evaluate([FromBody]RestEquation equation)
        {
            if (string.IsNullOrWhiteSpace(equation?.Equation))
            {
                return new RestEvaluationResult { Success = true, Value = 0 };
            }

            try
            {
                var parsed = new Equation(id: 0, serialized: Uri.UnescapeDataString(equation.Equation));
                var result = parsed.Evaluate(equation.Parameters);
                return new RestEvaluationResult { Success = true, Value = result };
            }
            catch
            {
                return new RestEvaluationResult { Success = false };
            }
        }
    }
}
