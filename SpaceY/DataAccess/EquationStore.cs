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
        /// <summary>
        /// Initializes a new instance of the <see cref="EquationStore"/> class.
        /// Loads a fixed set of default equations.
        /// </summary>
        public EquationStore()
        {
            Equations = new[]
            {
                new Equation(0, "1 + 2"),
                new Equation(1, "3 + 5"),
                new Equation(2, "Sin(0)"),
                new Equation(3, "1 + 2 + 3 + 4 + 5")
            }.AsQueryable();
            AllEquations = new[]
            {
                new Equation(0, "1 + 2"),
                new Equation(1, "3 + 5"),
                new Equation(2, "Sin(0)"),
                new Equation(3, "1 + 2 + 3 + 4 + 5"),
                new Equation(4, "7 * 7"),
                new Equation(5, "1 + 2"),
                new Equation(6, "3 + 5"),
                new Equation(7, "Sin(0)"),
                new Equation(8, "1 + 2 + 3 + 4 + 5"),
                new Equation(9, "7 * 7")
            }.AsQueryable();
        }

        /// <summary>
        /// Gets list of the most used stored equations
        /// </summary>
        public IQueryable<Equation> Equations { get; }

        /// <summary>
        /// Gets list of all stored equations
        /// </summary>
        public IQueryable<Equation> AllEquations { get; }
    }
}
