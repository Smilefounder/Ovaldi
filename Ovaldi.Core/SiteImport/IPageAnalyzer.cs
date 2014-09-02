using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovaldi.Core.SiteImport
{
    public interface IPageAnalyzer
    {
        void Analyze(AnalyzeContext context);
    }
}