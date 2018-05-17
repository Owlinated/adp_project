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

            if (!equation.Id.HasValue || equation.Id.Equals(-1))
            {
                equation.Id = parsed.Id;
                EquationStore.AddEquation(parsed);
            }
            else
            {
                parsed.Id = equation.Id.Value;
                EquationStore.UpdateEquation(parsed);
            }

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
        [HttpPost("{id}/[action]")]
        public object Evaluate(int id, [FromBody]Dictionary<int, Dictionary<int, double>> parameterValues)
        {
            EquationStore.IncreseEquationCounter(id);   //--- Each time we evaluate an already stored equation, we increase the usage counter.
            return EquationStore.AllEquations.FirstOrDefault(equation => equation.Id == id)?.Evaluate(parameterValues)
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
                var result = EquationStore.CreateEquation(equation).Evaluate();
                return new RestEvaluationResult { Success = true, Value = result };
            }
            catch
            {
                return new RestEvaluationResult { Success = false };
            }
        }

        /// <summary>
        /// Compute the value of an equation with the specified or default parameters.
        /// </summary>
        [HttpPost("{id}/[action]")]
        public IEnumerable<RestNestedEquation> Delete(int id, bool all)
        {
            try
            {
                EquationStore.DeleteEquation(id);
                return List(all);
            }
            catch
            {
                return List(all);
            }
        }

        /// <summary>
        /// Move equation with <paramref name="id"/> to index <paramref name="index"/>.
        /// </summary>
        [HttpGet("[action]")]
        public void Reorder(int id, int index)
        {
            EquationStore.Reorder(id, index);
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
                Description = equation.Description,
                Id = equation.Id,
                Equation = equation.Serialize(),
                Parameters = equation.Parameters
            };
        }
    }
}
