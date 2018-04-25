using System.Collections.Generic;
using System.Linq;
using SpaceY.Core;

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
            AddEquation(new Equation("1 + 2"));
            AddEquation(new Equation("3 + 5"));
            AddEquation(new Equation("Sin(0)"));
            AddEquation(new Equation("1 + 2 + 3 + 4 + 5"));
            AddEquation(new Equation("7 * 7"));
            AddEquation(new Equation("1 + 2"));
            AddEquation(new Equation("3 + 5"));
            AddEquation(new Equation("Sin(0)"));
            AddEquation(new Equation("1 + 2 + 3 + 4 + 5"));
            AddEquation(new Equation("7 * 7"));
        }

        /// <summary>
        /// Gets list of the most used stored equations
        /// </summary>
        public IQueryable<Equation> Equations => equations.Take(4).AsQueryable();

        /// <summary>
        /// Gets list of all stored equations
        /// </summary>
        public IQueryable<Equation> AllEquations => equations.AsQueryable();

        /// <summary>
        /// Adds a new equation to the store
        /// </summary>
        public void AddEquation(Equation equation)
        {
            equation.Id = counter++;
            equations.Add(equation);
        }
    }
}
