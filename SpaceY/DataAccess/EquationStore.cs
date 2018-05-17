using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using SpaceY.Core;
using SpaceY.Interface;

namespace SpaceY.DataAccess
{
    /// <summary>
    /// A store for equations.
    /// In the future this might have to be persisted or stored in a database
    /// contains a short list of equations to be shown on the homepage, and a longer with all available equations.
    /// </summary>
    public class EquationStore
    {
        private readonly List<Equation> equations = new List<Equation>();

        private int counter;

        /// <summary>
        /// Initializes a new instance of the <see cref="EquationStore"/> class.
        /// Loads a fixed set of default equations.
        /// </summary>
        public EquationStore()
        {
            AddEquation(new Equation("Simple plus V1", "1 + 2"));
            AddEquation(new Equation("Simple plus V2", "3 + 5"));
            AddEquation(new Equation("Simple Expression V1", "Sin(0)"));
            AddEquation(new Equation("Simple plus V3", "1 + 2 + 3 + 4 + 5"));
            AddEquation(new Equation("Simple Multiplication V1", "7 * 7"));
            AddEquation(new Equation("Simple plus V4", "5 + 2"));
            AddEquation(new Equation("Simple plus V5", "359780 + 5.5"));
            AddEquation(new Equation("Simple Expression V2", "Cos(0)"));
            AddEquation(new Equation("Simple plus V6", "2 + 4 + 6 + 8 + 9"));

            var equation1 = new Equation("Simple Multiplication V2", "5 * 7");
            AddEquation(equation1);

            var parameters2 = new[]
            {
                new RestEquationParam
                {
                    Standard = 1.0,
                    Description = "dummy",
                    Name = "d"
                }
            };
            var equation2 = new Equation(
                "Referencing Example",
                serialized: $"Ref({equation1.Id}) * Var(0) + 1",
                parameters: parameters2,
                references: new[] { equation1 });
            AddEquation(equation2);

            var parameters3 = new[]
            {
                new RestEquationParam
                {
                    Standard = 1.0,
                    Description = "dummy",
                    Name = "d"
                }
            };
            var equation3 = new Equation(
                "Complicated Referencing Example",
                serialized: $"Ref({equation1.Id}) + Ref({equation2.Id}) + 3.1415",
                parameters: parameters2,
                references: new[] { equation1, equation2 });
            AddEquation(equation3);
        }

        /// <summary>
        /// Gets list of the most used stored equations
        /// </summary>
        public IQueryable<Equation> Equations => equations.OrderByDescending(x => x.Counter).Take(4).AsQueryable();

        /// <summary>
        /// Gets list of all stored equations
        /// </summary>
        public IQueryable<Equation> AllEquations => equations.AsQueryable();

        /// <summary>
        /// Create an equation from the interface type.
        /// Does not save the equation.
        /// </summary>
        public Equation CreateEquation(RestEquation restEquation)
        {
            // Define regex for looking up ref(0) expressions
            var referenceRegEx = new Regex(@"Ref\((\d+)\)", RegexOptions.IgnoreCase);
            var referenceMatches = referenceRegEx.Matches(restEquation.Equation);

            // Foreach match, find its index and look that up.
            var referenceIds = referenceMatches.Select(refMatch => int.Parse(refMatch.Captures.First().Value.Substring(4).Replace(")", string.Empty)));
            var references = referenceIds
                            .Select(refId => AllEquations.FirstOrDefault(equation => equation.Id == refId))
                            .Where(reference => reference != null)
                            .ToList();

            // Create a new equation using the collected references and parameters
            return new Equation(restEquation.Description, restEquation.Equation, restEquation.Parameters, references);
        }

        /// <summary>
        /// Adds a new equation to the store.
        /// </summary>
        public void AddEquation(Equation equation)
        {
            equation.Id = counter++;
            equations.Add(equation);
        }

        /// <summary>
        /// Update an already saved equation into the store.
        /// </summary>
        public void UpdateEquation(Equation equation)
        {
            var updated = equations.FirstOrDefault(eq => eq.Id == equation.Id)
                ?? throw new System.ArgumentOutOfRangeException(nameof(equation));
            var index = equations.IndexOf(updated);
            equations[index] = equation;
        }

        /// <summary>
        /// Delete an equation from the store.
        /// </summary>
        public void DeleteEquation(int id)
        {
            equations.RemoveAll(x => x.Id.Equals(id));
        }

        /// <summary>
        /// Delete an equation from the store.
        /// </summary>
        public void IncreseEquationCounter(int id)
        {
            try
            {
                equations.Where(x => x.Id.Equals(id)).First().Counter++;
            }
            catch
            {
            }
        }

        /// <summary>
        /// Move equation with <paramref name="id"/> to <paramref name="index"/>.
        /// </summary>
        public void Reorder(int id, int index)
        {
            var removed = equations.FirstOrDefault(equation => equation.Id == id)
                ?? throw new System.ArgumentOutOfRangeException(nameof(id));
            equations.Remove(removed);
            equations.Insert(index, removed);
        }
    }
}
