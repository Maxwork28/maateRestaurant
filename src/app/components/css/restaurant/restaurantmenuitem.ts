import { StyleSheet } from 'react-native';

export const showMenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
topSection: {
  marginBottom: 20,
},
saveButton: {
  backgroundColor: "#FF5A1F",
  borderRadius: 8,
  paddingVertical: 6,
  justifyContent: "center",
  alignItems: "center",
},

header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},

planText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#DAA520', // gold-ish
},

activeStatus: {
  fontSize: 12,
  color: 'gray',
},

weekRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
},

weekItem: {
  alignItems: 'center',
  flex: 1,
},

weekDayText: {
  fontSize: 14,
  fontWeight: '500',
  marginBottom: 4,
  color:'black'
},

dateCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  color:'black'
},

dateActive: {
  borderColor: '#FF4500',
},

dateSelected: {
  borderColor: '#000',
  borderWidth: 2,
},

dateText: {
  color: '#000',
  fontWeight: '500',
},

dateTextSelected: {
  color: 'black',
  fontWeight: '600',
},

tabContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 10,
  marginBottom: 10,
  flexWrap: 'wrap',
},

weekTab: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 16,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#FF4500',
  marginHorizontal: 4,
},

weekTabActive: {
  backgroundColor: '#FF4500',
},

weekTabText: {
  color: '#FF4500',
  fontWeight: '500',
  fontSize: 13,
},

weekTabTextActive: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 13,
},


  calendarRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingVertical: 8,
  },

  activeCircle: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
matrixContainer: {
  marginTop: 16,
  paddingHorizontal: 10,
},

matrixRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  borderBottomWidth: 1,
  borderColor: '#ddd',
  paddingVertical: 8,
},

matrixHeader: {
  flex: 1,
  fontWeight: 'bold',
  fontSize: 14,
  textAlign: 'center',
   color:'#FF4500'
},
matrixHeaderlabel: {
  flex: 1,
  fontWeight: 'bold',
  fontSize: 14,
  textAlign: 'center',
},
mealType: {
  flex: 1,
  fontWeight: '600',
  fontSize: 14,
  textAlign: 'left',
   color:'#FF4500'
},

mealCell: {
  flex: 1,
  alignItems: 'center',
  paddingHorizontal: 4,
},

mealName: {
  fontWeight: '600',
  fontSize: 13,
  color:"black"
},

mealDesc: {
  fontSize: 12,
  color: 'gray',
},

mealCal: {
  fontSize: 11,
  color: '#888',
},
 modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
  },
});
