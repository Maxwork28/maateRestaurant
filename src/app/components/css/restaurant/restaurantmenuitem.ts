import { StyleSheet } from 'react-native';

export const showMenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F1',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
topSection: {
  marginBottom: 20,
},
saveButton: {
  backgroundColor: "#6F32AB",
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
  minHeight: 80,
},

planText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#434140',
},

activeStatus: {
  fontSize: 12,
  color: '#434140',
  fontWeight: '500',
},

weekRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  paddingHorizontal: 8,
},

weekItem: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 80,
},

weekDayText: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 6,
  color: '#434140',
  textAlign: 'center',
},

dateCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: '#E0E0E0',
  backgroundColor: '#FDF7F1',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 4,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},

dateActive: {
  borderColor: '#6F32AB',
  backgroundColor: '#6F32AB',
},

dateSelected: {
  borderColor: '#6F32AB',
  borderWidth: 3,
  backgroundColor: '#6F32AB',
},

dateText: {
  color: '#434140',
  fontWeight: '600',
  fontSize: 14,
},

dateTextSelected: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 14,
},

tabContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 10,
  marginBottom: 10,
  flexWrap: 'wrap',
},

weekTab: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  backgroundColor: '#FDF7F1',
  borderWidth: 2,
  borderColor: '#6F32AB',
  marginHorizontal: 4,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},

weekTabActive: {
  backgroundColor: '#6F32AB',
  borderColor: '#6F32AB',
},

weekTabText: {
  color: '#6F32AB',
  fontWeight: '600',
  fontSize: 12,
  textAlign: 'center',
},

weekTabTextActive: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 12,
  textAlign: 'center',
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
  minWidth: 600, // Ensure minimum width for horizontal scrolling
  backgroundColor: '#FDF7F1',
  borderRadius: 16,
  padding: 16,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
},

matrixRow: {
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderColor: '#E0E0E0',
  paddingVertical: 16,
  minHeight: 70,
  minWidth: 600, // Ensure minimum width for horizontal scrolling
},

matrixHeader: {
  width: 150, // Fixed width instead of flex
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
  color: '#6F32AB',
  paddingHorizontal: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},
matrixHeaderlabel: {
  width: 100, // Fixed width for day column
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
  color: '#434140',
  paddingHorizontal: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},
mealType: {
  width: 100, // Fixed width to match header
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'left',
  color: '#6F32AB',
  paddingHorizontal: 8,
},

mealCell: {
  width: 150, // Fixed width to match header
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 8,
  minHeight: 60,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  marginHorizontal: 4,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},

mealName: {
  fontWeight: '600',
  fontSize: 14,
  color: '#434140',
  textAlign: 'center',
  marginBottom: 4,
},

mealDesc: {
  fontSize: 12,
  color: 'gray',
},

mealCal: {
  fontSize: 12,
  color: '#6F32AB',
  textAlign: 'center',
  fontWeight: '500',
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
