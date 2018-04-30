using System;
using System.Collections.Generic;
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
        /// <summary>
        /// Initializes a new instance of the <see cref="EquationsController"/> class.
        /// </summary>
        /// <param name="equationStore">Store of equation from DI</param>
        public EquationsController(EquationStore equationStore)
        {
            EquationStore = equationStore;
        }

        private EquationStore EquationStore { get; }

        /// <summary>
        /// Creates a new equation.
        /// </summary>
        [HttpPost]
        public CreatedResult Create([FromBody]RestEquation equation)
        {
            var parsed = EquationStore.CreateEquation(equation);
            EquationStore.AddEquation(parsed);

            equation.Id = parsed.Id;
            return Created($"/equations/{parsed.Id}", equation);
        }

        /// <summary>
        /// Get list of all equations, couldn't get it to pass a boolean so it checks a string for now.
        /// </summary>
        [HttpGet]
        public IEnumerable<RestNestedEquation> List(bool all)
        {
            return all
                ? EquationStore.AllEquations.AsEnumerable().Select(ConvertToNested)
                : EquationStore.Equations.AsEnumerable().Select(ConvertToNested);
        }

        /// <summary>
        /// Get equation with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}")]
        public RestNestedEquation Get(int id)
        {
            var result = EquationStore.AllEquations.FirstOrDefault(equation => equation.Id == id) ??
                         throw new ArgumentException(nameof(id));
            return ConvertToNested(result);
        }

        /// <summary>
        /// Get the value of equation with <paramref name="id"/>.
        /// </summary>
        [HttpGet("{id}/[action]")]
        public object Evaluate(int id, Dictionary<int, Dictionary<int, double>> parameterValues)
        {
            return EquationStore.AllEquations.FirstOrDefault(equation => equation.Id == id)?.Evaluate(parameterValues)
                ?? throw new ArgumentException(nameof(id));
        }

        /// <summary>
        /// Compute the value of an equation with the specified or default parameters.
        /// </summary>
        [HttpPost("[action]")]
        public object Evaluate([FromBody]RestEquation equation, Dictionary<int, Dictionary<int, double>> parameterValues)
        {
            if (string.IsNullOrWhiteSpace(equation?.Equation))
            {
                return new RestEvaluationResult { Success = true, Value = 0 };
            }

            try
            {
                var result = EquationStore.CreateEquation(equation).Evaluate(parameterValues);
                return new RestEvaluationResult { Success = true, Value = result };
            }
            catch
            {
                return new RestEvaluationResult { Success = false };
            }
        }

        private static RestNestedEquation ConvertToNested(Equation equation)
        {
            return new RestNestedEquation
            {
                Main = ConvertToSimple(equation),
                References = equation.References.Select(ConvertToSimple).ToList()
            };
        }

        private static RestEquation ConvertToSimple(Equation equation)
        {
            return new RestEquation
            {
                Id = equation.Id,
                Equation = equation.Serialize(),
                Parameters = equation.Parameters
            };
        }
    }
}
