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
            string Var(int index) => $"Var({index})";
            string Ref(Equation reference) => $"Ref({reference.Id})";

            var gravityParams = new[]
            {
                new RestEquationParam
                {
                    Description = "Gravitation (m/s²)",
                    Name = "g",
                    Standard = 9.81
                }
            };
            var gravity = new Equation("Gravity (m/s²)", Var(0), gravityParams);
            AddEquation(gravity);

            var exhaustParams = new[]
            {
                new RestEquationParam
                {
                    Description = "Specific Impulse (s)",
                    Name = "Isp",
                    Standard = 5
                }
            };
            var exhaustVelocity = new Equation(
                "Exhaust Velocity (m/s)",
                $"{Ref(gravity)}*{Var(0)}",
                parameters: exhaustParams,
                references: new[] { gravity });
            AddEquation(exhaustVelocity);

            var massFlowParams = new[]
            {
                new RestEquationParam
                {
                    Description = "Propellant Mass Burnt (KG)",
                    Name = "m",
                    Standard = 100
                },
                new RestEquationParam
                {
                    Description = "Burn Duration (s)",
                    Name = "d",
                    Standard = 5
                }
            };
            var massFlow = new Equation("Mass Flow (KG/s)", $"{Var(0)}/{Var(1)}", massFlowParams);
            AddEquation(massFlow);

            var thrust = new Equation(
                "Thrust (N)",
                $"{Ref(massFlow)}*{Ref(exhaustVelocity)}",
                parameters: null,
                references: new[] { massFlow, exhaustVelocity });
            AddEquation(thrust);
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

            // Resolve references, until no more can be added or max depth is reached.
            const int maxDepth = 100;
            for (var i = 0; i < maxDepth; i++)
            {
                if (!AddReferences(references))
                {
                    break;
                }
            }

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
        public void IncreaseEquationCounter(int id)
        {
            try
            {
                equations.First(x => x.Id.Equals(id)).Counter++;
            }
            catch
            {
                // Ignored
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

        /// <summary>
        /// Add references of <paramref name="sourceEquations"/> to the list.
        /// </summary>
        /// <returns>True if any references were added, false otherwise.</returns>
        private bool AddReferences(List<Equation> sourceEquations)
        {
            var referenced = sourceEquations.SelectMany(equation => equation.References);
            var added = referenced.Distinct().Except(sourceEquations).ToList();
            if (!added.Any())
            {
                return false;
            }

            sourceEquations.InsertRange(index: 0, collection: added);
            return true;
        }
    }
}
