using System.Linq;
using SpaceY.Core;

namespace SpaceY.DataAccess
{
    /// <summary>
    /// A store for equations.
    /// In the future this might have to be persisted or stored in a database
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
        }

        /// <summary>
        /// Gets list of stored equations
        /// </summary>
        public IQueryable<Equation> Equations { get; }
    }
}
