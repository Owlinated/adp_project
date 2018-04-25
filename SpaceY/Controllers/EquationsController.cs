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
        /// Get list of all equations, couldn't get it to pass a boolean so it checks a string for now.
        /// </summary>
        [HttpGet]
        public IEnumerable<RestEquation> List(string all)
        {
            if (all == "true")
            {
                return EquationStore.AllEquations
                .Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() });
            }

            return EquationStore.Equations
                .Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() });
        }

        /// <summary>
        /// Get equation with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}")]
        public RestEquation Get(int id)
        {
            return EquationStore.AllEquations
                    .Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() })
                    .FirstOrDefault(equation => equation.Id == id)
                ?? throw new ArgumentException(nameof(id));
        }

        /// <summary>
        /// Get the value of equation with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}/[action]")]
        public object Evaluate(int id, RestEquationParam[] parameters)
        {
            return EquationStore.AllEquations.FirstOrDefault(equation => equation.Id == id)?.Evaluate()
                ?? throw new ArgumentException(nameof(id));
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
                var result = Equation.Create(id: 0, equation: equation).Evaluate();
                return new RestEvaluationResult { Success = true, Value = result };
            }
            catch
            {
                return new RestEvaluationResult { Success = false };
            }
        }
    }
}
