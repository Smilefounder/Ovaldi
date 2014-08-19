#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.IO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Ovaldi.Core.Persistence.FileSystem
{
    public static class XmlSerialization
    {
        #region Serialize
        //public static void Serialize<T>(T o, string filePath)
        //{
        //    Serialize(o, filePath, null);
        //}
        //public static void Serialize<T>(T o, string filePath, DataContractSerializerSettings settings)
        //{
        //    string folderPath = Path.GetDirectoryName(filePath);
        //    IOUtility.EnsureDirectoryExists(folderPath);
        //    using (FileStream stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        Serialize<T>(o, stream, settings);
        //    }
        //}

        public static void Serialize<T>(T o, Stream stream, DataContractSerializerSettings settings)
        {
            DataContractSerializer ser = new DataContractSerializer(typeof(T), settings);
            var xmlFormat = new XmlWriterSettings()
            {
                CheckCharacters = false,
                Indent = true,
                IndentChars = "\t"
            };
            using (var writer = XmlWriter.Create(stream, xmlFormat))
            {
                ser.WriteObject(writer, o);
            }
        }
        #endregion

        #region Deserialize
        //public static T Deserialize<T>(string filePath)
        //{
        //    return (T)Deserialize(typeof(T), filePath, null);
        //}
        //public static object Deserialize(Type type, string filePath, DataContractSerializerSettings settings)
        //{
        //    using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
        //    {
        //        return Deserialize(type, stream, settings);
        //    }
        //}

        public static object Deserialize(Type type, Stream stream, DataContractSerializerSettings settings)
        {
            DataContractSerializer ser = new DataContractSerializer(type, settings);
            if (stream.Length > 0)
            {
                try
                {
                    return ser.ReadObject(stream);
                }
                catch (Exception e)
                {
                    Kooboo.Common.Logging.Logger.Error(e.Message, e);
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        #endregion
    }
}
