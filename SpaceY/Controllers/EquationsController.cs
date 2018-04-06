using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Coffee;
using SpaceY.DataAccess;

namespace SpaceY.Controllers
{
	[Route("api/[controller]")]
	public class EquationsController : Controller
	{
		private EquationsStore equationsStore { get; } = new EquationsStore();

		[HttpGet("{id}")]
		public RestEquation Get(int id)
		{
			return equationsStore.Equations
					.Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() })
					.FirstOrDefault(equation => equation.Id == id)
				?? throw new ArgumentException(nameof(id));
		}

		[HttpGet("[action]")]
		public IEnumerable<RestEquation> List()
		{
			return equationsStore.Equations
				.Select(equation => new RestEquation { Id = equation.Id, Equation = equation.Serialize() });
		}

		[HttpGet("[action]/{id}")]
		public float Evaluate(int id)
		{
			return equationsStore.Equations.FirstOrDefault(equation => equation.Id == id)?.Evaluate()
				?? throw new ArgumentException(nameof(id));
		}

		public class RestEquation
		{
			public int Id { get; set; }
			public string Equation { get; set; }
		}
	}
}