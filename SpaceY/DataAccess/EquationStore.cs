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
		public IQueryable<Equation> Equations {get; }

		public EquationStore()
		{
			Equations = new[]
			{
				new Equation(0, "1+1"),
				new Equation(1, "1+1"),
				new Equation(2, "1+1"),
				new Equation(3, "1+1"),
				new Equation(4, "1+1")
			}.AsQueryable();
		}
	}
}
