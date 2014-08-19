#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem.Storage
{
    public interface IFileStorage<T>
         where T : new()
    {
        IEnumerable<T> GetList(string parentItemName = null);
        T Get(T dummy);
        void Add(T item, bool @override = true);
        void Update(T item, T oldItem);
        void Remove(T item);

        void Export(IEnumerable<T> items, Stream outputStream);

        void Import(Stream zipStream, bool @override);
    }
}
