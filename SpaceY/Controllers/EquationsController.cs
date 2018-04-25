using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Core;
using SpaceY.DataAccess;

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
        /// Get the value of location with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}/[action]")]
        public object Evaluate(int id)
        {
            return EquationStore.AllEquations.FirstOrDefault(equation => equation.Id == id)?.Evaluate()
                ?? throw new ArgumentException(nameof(id));
        }

        /// <summary>
        /// Compute the value of an equation with the specified or default parameters.
        /// </summary>
        [HttpGet("[action]")]
        public object Evaluate(string eq)
        {
            if (string.IsNullOrWhiteSpace(eq))
            {
                return new EvaluationResult { Success = true, Value = 0 };
            }

            try
            {
                var result = new Equation(0, Uri.UnescapeDataString(eq)).Evaluate();
                return new EvaluationResult { Success = true, Value = result };
            }
            catch
            {
                return new EvaluationResult { Success = false };
            }
        }

        /// <summary>
        /// Equation representation that is shared between client and server.
        /// </summary>
        public class RestEquation
        {
            /// <summary>
            /// Gets or sets identifier of equation.
            /// </summary>
            public int Id { get; set; }

            /// <summary>
            /// Gets or sets the serialized equation.
            /// </summary>
            public string Equation { get; set; }
        }

        /// <summary>
        /// Result of an equations evaluation
        /// </summary>
        public class EvaluationResult
        {
            /// <summary>
            /// Gets or sets a value indicating whether the evaluation was successful.
            /// </summary>
            public bool Success { get; set; }

            /// <summary>
            /// Gets or sets the value to which the equation was evaluated.
            /// </summary>
            public object Value { get; set; }
        }
    }
}
