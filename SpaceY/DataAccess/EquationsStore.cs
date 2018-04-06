using System.Collections.Generic;
using SpaceY.Coffee;

namespace SpaceY.DataAccess
{
	public class EquationsStore
	{
		public ICollection<Equation> Equations {get; }

		public EquationsStore()
		{
			Equations = new[]
			{
				new Equation(0, "1+1")
			};
		}
	}
}
